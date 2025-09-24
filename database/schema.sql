-- SRM University OD Management System Database Schema

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'super-secret-jwt-token-with-at-least-32-characters-long';

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  roll_no TEXT UNIQUE, -- e.g., RA2311003040056
  class TEXT, -- e.g., CSE
  year TEXT, -- e.g., II
  section TEXT, -- e.g., A
  role TEXT CHECK (role IN ('student', 'faculty', 'hod')) NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OD Requests table
CREATE TABLE IF NOT EXISTS od_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_period TEXT NOT NULL, -- e.g., "1st Period"
  end_period TEXT NOT NULL, -- e.g., "7th Period"
  reason TEXT,
  proof_url TEXT, -- Supabase Storage signed URL
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES users(id), -- HOD who approved/rejected
  approved_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_od_requests_student_id ON od_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_od_requests_status ON od_requests(status);
CREATE INDEX IF NOT EXISTS idx_od_requests_date ON od_requests(date);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_roll_no ON users(roll_no);

-- Storage bucket for proofs
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

CREATE POLICY "Users can read all profiles" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- OD Requests table policies
ALTER TABLE od_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read their own requests" ON od_requests
FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('faculty', 'hod')
  )
);

CREATE POLICY "Students can create their own requests" ON od_requests
FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own pending requests" ON od_requests
FOR UPDATE USING (
  auth.uid() = student_id AND status = 'pending'
);

CREATE POLICY "HOD can update request status" ON od_requests
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'hod'
  )
);

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for od_requests table
DROP TRIGGER IF EXISTS update_od_requests_updated_at ON od_requests;
CREATE TRIGGER update_od_requests_updated_at
    BEFORE UPDATE ON od_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to set approved_at when status changes to approved
CREATE OR REPLACE FUNCTION set_approved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        NEW.approved_at = NOW();
        NEW.approved_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to set approved_at
DROP TRIGGER IF EXISTS set_od_request_approved_at ON od_requests;
CREATE TRIGGER set_od_request_approved_at
    BEFORE UPDATE ON od_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_approved_at();

-- Sample data for development (optional)
-- Insert sample users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'student1@srmist.edu.in', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000000-0000-0000-0000-000000000002', 'faculty1@srmist.edu.in', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000000-0000-0000-0000-000000000003', 'hod1@srmist.edu.in', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}')
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding user profiles
INSERT INTO users (id, name, email, roll_no, class, year, section, role) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Rahul Sharma', 'student1@srmist.edu.in', 'RA2311003040056', 'CSE', 'II', 'A', 'student'),
  ('00000000-0000-0000-0000-000000000002', 'Dr. Priya Patel', 'faculty1@srmist.edu.in', NULL, NULL, NULL, NULL, 'faculty'),
  ('00000000-0000-0000-0000-000000000003', 'Prof. Amit Kumar', 'hod1@srmist.edu.in', NULL, NULL, NULL, NULL, 'hod')
ON CONFLICT (id) DO NOTHING;

-- Insert sample OD request
INSERT INTO od_requests (student_id, event_name, date, start_period, end_period, reason, status) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'IEEE Technical Symposium', CURRENT_DATE + INTERVAL '1 day', '3rd Period', '6th Period', 'Participating in coding competition and technical presentation', 'pending')
ON CONFLICT DO NOTHING;