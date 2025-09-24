-- SRM University OD Management System - Enhanced Database Schema
-- Updated to match the workflow: Student → Class In-Charge → HOD → Final Approval

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with enhanced role structure
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  roll_no TEXT UNIQUE, -- For students only (e.g., RA2311003040056)
  class TEXT, -- e.g., CSE, ECE, IT
  year TEXT, -- e.g., I, II, III, IV
  section TEXT, -- e.g., A, B, C
  role TEXT CHECK (role IN ('student', 'class_incharge', 'hod', 'faculty')) NOT NULL,
  department TEXT, -- For faculty/class_incharge/hod
  is_class_incharge_for TEXT, -- Which class this faculty is in-charge of (e.g., 'CSE-II-A')
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced OD Requests table with multi-level approval workflow
CREATE TABLE IF NOT EXISTS od_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Request Details
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  name TEXT NOT NULL, -- Student name (can be different from profile)
  class TEXT NOT NULL,
  year TEXT NOT NULL,
  section TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  
  -- File Storage
  proof_url TEXT, -- Supabase Storage URL
  proof_filename TEXT,
  
  -- Multi-level Approval Status
  status TEXT CHECK (status IN ('pending', 'approved_by_class_incharge', 'approved_by_hod', 'rejected_by_class_incharge', 'rejected_by_hod')) DEFAULT 'pending',
  
  -- Approval Details
  class_incharge_id UUID REFERENCES users(id),
  class_incharge_approved_at TIMESTAMPTZ,
  class_incharge_comments TEXT,
  
  hod_id UUID REFERENCES users(id),
  hod_approved_at TIMESTAMPTZ,
  hod_comments TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table for real-time updates
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  od_request_id UUID REFERENCES od_requests(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('class_incharge_approved', 'class_incharge_rejected', 'hod_approved', 'hod_rejected', 'new_request')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_od_requests_student_id ON od_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_od_requests_status ON od_requests(status);
CREATE INDEX IF NOT EXISTS idx_od_requests_from_date ON od_requests(from_date);
CREATE INDEX IF NOT EXISTS idx_od_requests_to_date ON od_requests(to_date);
CREATE INDEX IF NOT EXISTS idx_od_requests_class ON od_requests(class);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_class ON users(class);
CREATE INDEX IF NOT EXISTS idx_users_is_class_incharge_for ON users(is_class_incharge_for);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Storage bucket for proof documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('od-proofs', 'od-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow authenticated users to upload proof files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'od-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to proof files" ON storage.objects
FOR SELECT USING (bucket_id = 'od-proofs');

CREATE POLICY "Allow users to update their own proof files" ON storage.objects
FOR UPDATE USING (bucket_id = 'od-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own proof files" ON storage.objects
FOR DELETE USING (bucket_id = 'od-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Row Level Security Policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all user profiles" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- OD Requests table policies
ALTER TABLE od_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read their own requests" ON od_requests
FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Class in-charges can read requests from their class" ON od_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'class_incharge'
    AND users.is_class_incharge_for = CONCAT(od_requests.class, '-', od_requests.year, '-', od_requests.section)
  )
);

CREATE POLICY "HODs can read requests approved by class in-charge" ON od_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'hod'
    AND (od_requests.status = 'approved_by_class_incharge' OR od_requests.status = 'approved_by_hod' OR od_requests.status = 'rejected_by_hod')
  )
);

CREATE POLICY "Faculty can read final approved requests" ON od_requests
FOR SELECT USING (
  od_requests.status = 'approved_by_hod' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('faculty', 'class_incharge', 'hod')
  )
);

CREATE POLICY "Students can create their own requests" ON od_requests
FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own pending requests" ON od_requests
FOR UPDATE USING (
  auth.uid() = student_id AND status = 'pending'
);

CREATE POLICY "Class in-charges can update requests from their class" ON od_requests
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'class_incharge'
    AND users.is_class_incharge_for = CONCAT(od_requests.class, '-', od_requests.year, '-', od_requests.section)
  )
);

CREATE POLICY "HODs can update requests approved by class in-charge" ON od_requests
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'hod'
    AND od_requests.status = 'approved_by_class_incharge'
  )
);

-- Notifications table policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for timestamp updates
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_od_requests_updated_at ON od_requests;
CREATE TRIGGER update_od_requests_updated_at
    BEFORE UPDATE ON od_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create notifications on status change
CREATE OR REPLACE FUNCTION create_status_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Class In-Charge Approval
    IF NEW.status = 'approved_by_class_incharge' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (user_id, od_request_id, type, title, message)
        VALUES (
            NEW.student_id,
            NEW.id,
            'class_incharge_approved',
            'OD Request Approved by Class In-Charge',
            'Your OD request for ' || NEW.from_date || ' to ' || NEW.to_date || ' has been approved by your class in-charge and forwarded to HOD for final approval.'
        );
        
        -- Notify HOD about new request to review
        INSERT INTO notifications (
            user_id, 
            od_request_id, 
            type, 
            title, 
            message
        )
        SELECT 
            users.id,
            NEW.id,
            'new_request',
            'New OD Request for Review',
            'A new OD request from ' || NEW.name || ' (' || NEW.roll_no || ') needs your approval.'
        FROM users 
        WHERE users.role = 'hod' 
        AND users.department = NEW.class;
    
    -- Class In-Charge Rejection
    ELSIF NEW.status = 'rejected_by_class_incharge' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (user_id, od_request_id, type, title, message)
        VALUES (
            NEW.student_id,
            NEW.id,
            'class_incharge_rejected',
            'OD Request Rejected by Class In-Charge',
            'Your OD request for ' || NEW.from_date || ' to ' || NEW.to_date || ' has been rejected by your class in-charge.' ||
            CASE WHEN NEW.class_incharge_comments IS NOT NULL THEN ' Reason: ' || NEW.class_incharge_comments ELSE '' END
        );
    
    -- HOD Approval
    ELSIF NEW.status = 'approved_by_hod' AND OLD.status = 'approved_by_class_incharge' THEN
        INSERT INTO notifications (user_id, od_request_id, type, title, message)
        VALUES (
            NEW.student_id,
            NEW.id,
            'hod_approved',
            'OD Request Finally Approved',
            'Congratulations! Your OD request for ' || NEW.from_date || ' to ' || NEW.to_date || ' has been finally approved by the HOD. You can now attend the event.'
        );
    
    -- HOD Rejection
    ELSIF NEW.status = 'rejected_by_hod' AND OLD.status = 'approved_by_class_incharge' THEN
        INSERT INTO notifications (user_id, od_request_id, type, title, message)
        VALUES (
            NEW.student_id,
            NEW.id,
            'hod_rejected',
            'OD Request Rejected by HOD',
            'Your OD request for ' || NEW.from_date || ' to ' || NEW.to_date || ' has been rejected by the HOD.' ||
            CASE WHEN NEW.hod_comments IS NOT NULL THEN ' Reason: ' || NEW.hod_comments ELSE '' END
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create notifications on status change
DROP TRIGGER IF EXISTS create_od_status_notification ON od_requests;
CREATE TRIGGER create_od_status_notification
    AFTER UPDATE ON od_requests
    FOR EACH ROW
    EXECUTE FUNCTION create_status_notification();

-- Function to set approval timestamps and user IDs
CREATE OR REPLACE FUNCTION set_approval_details()
RETURNS TRIGGER AS $$
BEGIN
    -- Class In-Charge approval
    IF NEW.status = 'approved_by_class_incharge' AND OLD.status = 'pending' THEN
        NEW.class_incharge_id = auth.uid();
        NEW.class_incharge_approved_at = NOW();
    -- Class In-Charge rejection
    ELSIF NEW.status = 'rejected_by_class_incharge' AND OLD.status = 'pending' THEN
        NEW.class_incharge_id = auth.uid();
        NEW.class_incharge_approved_at = NOW();
    -- HOD approval
    ELSIF NEW.status = 'approved_by_hod' AND OLD.status = 'approved_by_class_incharge' THEN
        NEW.hod_id = auth.uid();
        NEW.hod_approved_at = NOW();
    -- HOD rejection
    ELSIF NEW.status = 'rejected_by_hod' AND OLD.status = 'approved_by_class_incharge' THEN
        NEW.hod_id = auth.uid();
        NEW.hod_approved_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to set approval details
DROP TRIGGER IF EXISTS set_od_approval_details ON od_requests;
CREATE TRIGGER set_od_approval_details
    BEFORE UPDATE ON od_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_approval_details();

-- Sample data for development
-- Insert sample users with proper auth setup
INSERT INTO users (id, name, email, roll_no, class, year, section, role, department, is_class_incharge_for) 
VALUES 
  -- Students
  ('11111111-1111-1111-1111-111111111111', 'Rahul Sharma', 'rahul.sharma@srmist.edu.in', 'RA2311003040056', 'CSE', 'II', 'A', 'student', NULL, NULL),
  ('22222222-2222-2222-2222-222222222222', 'Priya Patel', 'priya.patel@srmist.edu.in', 'RA2311003040057', 'CSE', 'II', 'A', 'student', NULL, NULL),
  ('33333333-3333-3333-3333-333333333333', 'Amit Kumar', 'amit.kumar@srmist.edu.in', 'RA2311003040058', 'ECE', 'III', 'B', 'student', NULL, NULL),
  
  -- Class In-Charges
  ('44444444-4444-4444-4444-444444444444', 'Dr. Sunita Gupta', 'sunita.gupta@srmist.edu.in', NULL, NULL, NULL, NULL, 'class_incharge', 'CSE', 'CSE-II-A'),
  ('55555555-5555-5555-5555-555555555555', 'Prof. Rajesh Mehta', 'rajesh.mehta@srmist.edu.in', NULL, NULL, NULL, NULL, 'class_incharge', 'ECE', 'ECE-III-B'),
  
  -- HODs
  ('66666666-6666-6666-6666-666666666666', 'Prof. Dr. Kavita Singh', 'kavita.singh@srmist.edu.in', NULL, NULL, NULL, NULL, 'hod', 'CSE', NULL),
  ('77777777-7777-7777-7777-777777777777', 'Prof. Dr. Manoj Yadav', 'manoj.yadav@srmist.edu.in', NULL, NULL, NULL, NULL, 'hod', 'ECE', NULL),
  
  -- General Faculty
  ('88888888-8888-8888-8888-888888888888', 'Dr. Neha Agarwal', 'neha.agarwal@srmist.edu.in', NULL, NULL, NULL, NULL, 'faculty', 'CSE', NULL),
  ('99999999-9999-9999-9999-999999999999', 'Prof. Vikram Joshi', 'vikram.joshi@srmist.edu.in', NULL, NULL, NULL, NULL, 'faculty', 'ECE', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample OD requests to demonstrate workflow
INSERT INTO od_requests (
  id, student_id, from_date, to_date, name, class, year, section, roll_no, 
  reason, description, status
) VALUES 
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    CURRENT_DATE + INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '3 days',
    'Rahul Sharma',
    'CSE',
    'II',
    'A',
    'RA2311003040056',
    'IEEE Technical Conference',
    'Participating in IEEE International Conference on Computer Science and presenting research paper on AI/ML algorithms.',
    'pending'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '5 days',
    'Priya Patel',
    'CSE',
    'II',
    'A',
    'RA2311003040057',
    'Hackathon Competition',
    'Participating in National Level Hackathon organized by Google Developer Community.',
    'approved_by_class_incharge'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    CURRENT_DATE - INTERVAL '1 day',
    CURRENT_DATE - INTERVAL '1 day',
    'Amit Kumar',
    'ECE',
    'III',
    'B',
    'RA2311003040058',
    'Industry Visit',
    'Educational visit to ISRO for understanding satellite communication systems.',
    'approved_by_hod'
  )
ON CONFLICT (id) DO NOTHING;

-- Create a view for today's approved OD activities
CREATE OR REPLACE VIEW todays_od_activities AS
SELECT 
  r.*,
  u.name as student_name,
  u.email as student_email
FROM od_requests r
JOIN users u ON r.student_id = u.id
WHERE r.status = 'approved_by_hod'
  AND CURRENT_DATE BETWEEN r.from_date AND r.to_date;

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW od_statistics AS
SELECT 
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
  COUNT(*) FILTER (WHERE status = 'approved_by_class_incharge') as class_incharge_approved,
  COUNT(*) FILTER (WHERE status = 'approved_by_hod') as hod_approved,
  COUNT(*) FILTER (WHERE status LIKE '%rejected%') as rejected_requests,
  COUNT(*) FILTER (WHERE CURRENT_DATE BETWEEN from_date AND to_date AND status = 'approved_by_hod') as active_today
FROM od_requests;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;