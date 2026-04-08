-- ============================================
-- Udemy Course Management System
-- Seed Data (INSERT only — schema in init.sql)
-- CSE 326: ISD Sessional | Group C1_4
-- ============================================
 TRUNCATE TABLE
    material_access, course_progress,
    video_progress, enrollments, materials,
    video_lectures, sections, courses, users
    -- reviews

RESTART IDENTITY CASCADE;
-- ============================================\
-- 1. USERS
-- Password for ALL: "password123"
-- ============================================
INSERT INTO users (name, email, password, role) VALUES
('Instructor Karim',  'karim@test.com',  'password123'  ,'instructor'),
('Student Shatabdi',  'shatabdi@test.com', 'password123','student'),
('Student Shadman',   'shadman@test.com',  'password123', 'student'),
('Student Tanmi',     'tanmi@test.com',    'password123', 'student');
 
-- ============================================
-- 2. COURSES
-- ============================================
INSERT INTO courses (title, description, instructor_id, is_free, price, status) VALUES
(
  'Computer Networks: Complete Course',
  'A comprehensive course on computer networking covering foundations, direct links, network layer, transport layer, TCP/IP and congestion control. Based on Peterson & Davie.',
  1, FALSE, 1299.00, 'active'
),
(
  'TCP/IP and Transport Layer Deep Dive',
  'In-depth study of TCP, IP protocols, connection management, and reliable data transfer based on Peterson & Davie.',
  1, TRUE, 0.00, 'active'
);
 
-- ============================================
-- 3. SECTIONS
-- ============================================
INSERT INTO sections (course_id, title, position) VALUES
(1, 'Chapter 1: Foundation',          1),
(1, 'Chapter 2: Direct Links',        2),
(1, 'Chapter 4: Advanced Networking', 3),
(2, 'TCP Fundamentals',               1),
(2, 'TCP Congestion Control',         2);
 
-- ============================================
-- 4. VIDEO LECTURES
-- Real Cloudinary URLs — uploaded by Shatabdi
-- subtitle_url column added for VideoPlayer CC (Issue #2)
-- ============================================
INSERT INTO video_lectures (section_id, title, video_url, subtitle_url, duration, position) VALUES
(1, 'Chapter 1 - Lecture 1: Introduction to Networks',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657432/cse321-ch1-L1_gvdxrz.mp4',
    NULL, 599, 1),
 
(1, 'Chapter 1 - Lecture 2: Network Architecture',
    'https://res.cloudinary.com%2Fdwrdvofmu%2Fvideo%2Fupload%2Fv1775640143%2FLecture_16_htqnqz.mp4&h=AT7RB2Vp89qO4nFI9r9ZCBhpcFwGR06IJIRXCSJlC3hgBQ3BbI7eybsmIwSJ4IAEeyADFNXWOLemmuo262kFMn7RjO3vwxzRZz3_9gZ2QStKxJvG2NoFZgoP31cSjsU',
    NULL, 553, 2),
 
(1, 'Chapter 1 - Lecture 3: Performance Metrics',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657439/cse321-ch1-L3_ltt34d.mp4',
    NULL, 511, 3),
 
(1, 'Chapter 1 - Lecture 4: Protocol Layers',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657449/cse321-Ch1-L4_nwp4mj.mp4',
    NULL, 583, 4),
 
(2, 'Chapter 2 - Lecture 1: Direct Link Networks',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657450/cse321-Ch2-L1_eomwmv.mp4',
    NULL, 577, 1),
 
(2, 'Chapter 2 - Lecture 2: Framing and Error Detection',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657437/cse321-Ch2-L2_xfzmkq.mp4',
    NULL, 535, 2),
 
(2, 'Chapter 2 - Lecture 3: Reliable Transmission',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657439/cse321-Ch2-L3_fxwmhx.mp4',
    NULL, 538, 3),
 
(3, 'Chapter 4 - Lecture 11: Network Layer Overview',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657937/cse321-Ch4-L11_yv1d5g.mp4',
    NULL, 476, 1),
 
(3, 'Chapter 4 - Lecture 13: Routing Algorithms',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657937/cse321-Ch4-L13_w0evfb.mp4',
    NULL, 581, 2),
 
(3, 'Chapter 4 - Lecture 14: Congestion Control',
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657943/cse321-Ch4-L14_aukmhw.mp4',
    NULL, 558, 3);
 
-- ============================================
-- 5. MATERIALS
-- Using real publicly available PDFs for demo
-- Replace with actual Cloudinary URLs later
-- ============================================
INSERT INTO materials (section_id, title, file_url, file_type, download_allowed) VALUES
 
(1, 'Chapter 1 - Lecture Slides (PDF)',
    'https://www.rfc-editor.org/rfc/pdfrfc/rfc5681.txt.pdf',
    'pdf', TRUE),
 
(2, 'Chapter 2 - Direct Link Networks (PDF)',
    'https://www.rfc-editor.org/rfc/pdfrfc/rfc5681.txt.pdf',
    'pdf', TRUE),
 
(2, 'Chapter 2 - Error Detection Notes (PDF)',
    'https://www.rfc-editor.org/rfc/pdfrfc/rfc5681.txt.pdf',
    'pdf', TRUE),
 
(3, 'Chapter 4 - Congestion Control Notes (PDF)',
    'https://www.rfc-editor.org/rfc/pdfrfc/rfc5681.txt.pdf',
    'pdf', TRUE),
 
(4, 'TCP Protocol Reference (PDF)',
    'https://www.rfc-editor.org/rfc/pdfrfc/rfc793.txt.pdf',
    'pdf', TRUE),
 
(4, 'TCP Connection Management Notes (PDF)',
    'https://www.rfc-editor.org/rfc/pdfrfc/rfc793.txt.pdf',
    'pdf', TRUE),
 
(5, 'TCP Congestion Control Reference (PDF)',
    'https://www.rfc-editor.org/rfc/pdfrfc/rfc5681.txt.pdf',
    'pdf', FALSE);
 
-- ============================================
-- 6. ENROLLMENTS
-- user ids: Shatabdi=2, Shadman=3, Tanmi=4
-- ============================================
INSERT INTO enrollments (student_id, course_id) VALUES
(2, 1),
(3, 1),
(4, 1),
(2, 2),
(4, 2)
ON CONFLICT DO NOTHING;
 
-- ============================================
-- 7. VIDEO PROGRESS
-- Starting fresh — no pre-completed lectures
-- Progress tracked live by the app
-- ============================================
-- (no initial rows — app creates them on first watch)
 
-- ============================================
-- 8. COURSE PROGRESS (initial rows, all zero)
-- ============================================

INSERT INTO course_progress
    (student_id, course_id, completion_percentage, completed_lectures, total_lectures)
VALUES
(2, 1, 0.00, 0, 10),
(3, 1, 0.00, 0, 10),
(4, 1, 0.00, 0, 10),
(2, 2, 0.00, 0, 3),
(4, 2, 0.00, 0, 3)
ON CONFLICT DO NOTHING;

SELECT 'Seed data inserted successfully!' AS status