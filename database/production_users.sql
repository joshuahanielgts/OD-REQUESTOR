-- Production User Data Migration for SRM University CSE III-A Class
-- This script uses ONLY the students from the uploaded credentials file
-- 54 students + 2 faculty members - EXACTLY as provided

-- First, clear existing test data  
DELETE FROM od_requests;
DELETE FROM notifications;  
DELETE FROM users;

-- Insert ONLY the 54 real students from uploaded credentials file
INSERT INTO users (id, name, email, roll_no, class, year, section, role, department, is_class_incharge_for) VALUES
(gen_random_uuid(), 'Rohit Vikkranth S', 'rs5483@srmist.edu.in', 'rs5483', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Vinaya VR', 'vv7533@srmist.edu.in', 'vv7533', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Suryaprakasham', 'sb1995@srmist.edu.in', 'sb1995', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Nilesh J', 'nj6187@srmist.edu.in', 'nj6187', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Ashwin', 'ac3881@srmist.edu.in', 'ac3881', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Mohammed Ihsan N', 'mn0024@srmist.edu.in', 'mn0024', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Shanmathi K', 'sk8027@srmist.edu.in', 'sk8027', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Ashritha', 'ad0561@srmist.edu.in', 'ad0561', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Roshini', 'ry9932@srmist.edu.in', 'ry9932', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Jaivigensh', 'jk7808@srmist.edu.in', 'jk7808', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Vaasavi', 'vg6422@srmist.edu.in', 'vg6422', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Sai Shivaram', 'sl2359@srmist.edu.in', 'sl2359', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Athish Kirthik JD', 'aj2075@srmist.edu.in', 'aj2075', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Radhika Ganesh', 'rg0134@srmist.edu.in', 'rg0134', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Koduri Pranav', 'pk7960@srmist.edu.in', 'pk7960', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Sirushti', 'sk1897@srmist.edu.in', 'sk1897', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'R Sharan', 'sr6160@srmist.edu.in', 'sr6160', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Tharun Kumaar SD', 'ss1492@srmist.edu.in', 'ss1492', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Caroline Vineeta', 'cv1432@srmist.edu.in', 'cv1432', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Venkatapathy', 'vr3569@srmist.edu.in', 'vr3569', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Mani Shankar', 'mb1109@srmist.edu.in', 'mb1109', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Arjun KS', 'as2353@srmist.edu.in', 'as2353', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Charu Nethra', 'cr7821@srmist.edu.in', 'cr7821', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Vedika Singh', 'vs7190@srmist.edu.in', 'vs7190', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Archana R', 'ar6917@srmist.edu.in', 'ar6917', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Divya', 'dr1571@srmist.edu.in', 'dr1571', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'S Sharan', 'ss8795@srmist.edu.in', 'ss8795', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Senthil Nathan', 'sm0343@srmist.edu.in', 'sm0343', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Samiksha', 'ss8045@srmist.edu.in', 'ss8045', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'J Joshua Haniel', 'jj9568@srmist.edu.in', 'jj9568', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Deepti Varsha', 'gv2212@srmist.edu.in', 'gv2212', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Sneha Kumari', 'sk8361@srmist.edu.in', 'sk8361', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Gautam', 'gr3026@srmist.edu.in', 'gr3026', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Shreya', 'sr3590@srmist.edu.in', 'sr3590', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Sai Siva Ganesh', 'sg3142@srmist.edu.in', 'sg3142', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Sricharan', 'ss1833@srmist.edu.in', 'ss1833', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Jithin CM', 'jc8930@srmist.edu.in', 'jc8930', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Arjun Ashkar', 'aa1142@srmist.edu.in', 'aa1142', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Priangshu', 'ps1770@srmist.edu.in', 'ps1770', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Janardhan D', 'jd9812@srmist.edu.in', 'jd9812', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Anoop Mahesh', 'am4696@srmist.edu.in', 'am4696', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Akshaya G', 'ag2008@srmist.edu.in', 'ag2008', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Tamizhselvan', 'ts0372@srmist.edu.in', 'ts0372', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Prateek Sharma', 'ps2881@srmist.edu.in', 'ps2881', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Rohith G', 'rg5749@srmist.edu.in', 'rg5749', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Raj Ratna Rana', 'rr9014@srmist.edu.in', 'rr9014', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Sadhana S', 'sd6403@srmist.edu.in', 'sd6403', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Milendra Labana', 'ml6167@srmist.edu.in', 'ml6167', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Nishanthini', 'nb6703@srmist.edu.in', 'nb6703', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Annie Margaret', 'sm6568@srmist.edu.in', 'sm6568', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Rohith M', 'rm5260@srmist.edu.in', 'rm5260', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Jeyanirudh', 'jj5237@srmist.edu.in', 'jj5237', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Arjun Singh', 'as2532@srmist.edu.in', 'as2532', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Kethaki Chelli', 'kc2771@srmist.edu.in', 'kc2771', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Surya Sivakumar', 'ss4085@srmist.edu.in', 'ss4085', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Anshika Shukla', 'as0440@srmist.edu.in', 'as0440', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),
(gen_random_uuid(), 'Yashwant S', 'ys7013@srmist.edu.in', 'ys7013', 'B.Tech CSE', '3rd Year', 'III-A', 'student', 'CSE', NULL),

-- Class In-Charge for CSE III-A
(gen_random_uuid(), 'Mrs. Mary Shyni', 'maryshyni@srmist.edu.in', NULL, NULL, NULL, NULL, 'class_incharge', 'CSE', 'CSE-III-A'),

-- HOD (Head of Department) for CSE
(gen_random_uuid(), 'Dr. Golda Dilip', 'hod@srm', NULL, NULL, NULL, NULL, 'hod', 'CSE', NULL);

