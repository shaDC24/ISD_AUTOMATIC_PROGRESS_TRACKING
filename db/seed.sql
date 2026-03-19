-- ============================================
-- Udemy Course Management System
-- Seed Data (INSERT only — schema in init.sql)
-- CSE 326: ISD Sessional | Group C1_4
-- Run AFTER init.sql
-- ============================================

-- ============================================
-- 1. USERS
-- Password for ALL: "password123"
-- ============================================
INSERT INTO users (name, email, password, role) VALUES
('Instructor Karim',  'karim@test.com',    '$2b$10$473YY5FQqDTPz/kJ/pKb3O/psLmcO0F1em8wMhiAyfYNWJQkEswGi', 'instructor'),
('Student Shatabdi',  'shatabdi@test.com', '$2b$10$473YY5FQqDTPz/kJ/pKb3O/psLmcO0F1em8wMhiAyfYNWJQkEswGi', 'student'),
('Student Shadman',   'shadman@test.com',  '$2b$10$473YY5FQqDTPz/kJ/pKb3O/psLmcO0F1em8wMhiAyfYNWJQkEswGi', 'student'),
('Student Tanmi',     'tanmi@test.com',    '$2b$10$473YY5FQqDTPz/kJ/pKb3O/psLmcO0F1em8wMhiAyfYNWJQkEswGi', 'student');

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
    'https://res.cloudinary.com/dobnouuwt/video/upload/v1773657438/cse321-ch1-L2_bdrwaj.mp4',
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
-- Files stored in Cloudinary under
-- ISD-Feature-Implementation/resources/
-- Replace public_id with full URL pattern:
-- https://res.cloudinary.com/dobnouuwt/raw/upload/<public_id>
-- ============================================
INSERT INTO materials (section_id, title, file_url, file_type, download_allowed) VALUES
(1, 'Chapter 2 Lecture Slides',
    'https://res.cloudinary.com/dobnouuwt/raw/upload/ISD-Feature-Implementation/resources/Chapter_204_20-_20MAC-1.pdf',
    'pdf', TRUE),

(2, 'Chapter 5 Slides',
    'https://res.cloudinary.com/dobnouuwt/raw/upload/ISD-Feature-Implementation/resources/chapter5.ppt',
    'ppt', TRUE),

(2, 'Chapter 6 Slides',
    'https://res.cloudinary.com/dobnouuwt/raw/upload/ISD-Feature-Implementation/resources/chapter6.ppt',
    'ppt', TRUE),

(3, 'Congestion Control Notes',
    'https://res.cloudinary.com/dobnouuwt/raw/upload/ISD-Feature-Implementation/resources/Congestion_control_-_Peterson.pdf',
    'pdf', TRUE),

(4, 'Lecture Notes: TCP',
    'https://res.cloudinary.com/dobnouuwt/raw/upload/ISD-Feature-Implementation/resources/Lecture-TCP.pdf',
    'pdf', TRUE),

(4, 'Lecture Notes: TCP Connections',
    'https://res.cloudinary.com/dobnouuwt/raw/upload/ISD-Feature-Implementation/resources/Lecture-TCPCongestionControl.pdf',
    'pdf', TRUE),

(4, 'Course Material Pack (ZIP)',
    'https://res.cloudinary.com/dobnouuwt/raw/upload/ISD-Feature-Implementation/resources/material.zip',
    'zip', TRUE),

(5, 'Textbook Reference: Peterson & Davie',
    'https://res.cloudinary.com/dobnouuwt/raw/upload/ISD-Feature-Implementation/resources/TCP_-_Peterson.pdf',
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
-- 7. VIDEO PROGRESS (sample for demo/testing)
-- ============================================
INSERT INTO video_progress (student_id, lecture_id, watch_position, completion_percent, is_completed) VALUES
(2, 1, 599,  100.00, TRUE),
(2, 2, 553,  100.00, TRUE),
(2, 3, 470,  91.98,  TRUE),
(2, 4, 200,  34.31,  FALSE),
(3, 1, 599,  100.00, TRUE),
(3, 2, 180,  32.55,  FALSE),
(4, 1, 599,  100.00, TRUE),
(4, 2, 553,  100.00, TRUE),
(4, 3, 511,  100.00, TRUE),
(4, 4, 583,  100.00, TRUE),
(4, 5, 577,  100.00, TRUE)
ON CONFLICT (student_id, lecture_id) DO NOTHING;

-- ============================================
-- 8. COURSE PROGRESS
-- ============================================
INSERT INTO course_progress (student_id, course_id, completion_percentage, completed_lectures, total_lectures) VALUES
(2, 1, 30.00, 3, 10),
(3, 1, 10.00, 1, 10),
(4, 1, 50.00, 5, 10),
(2, 2, 0.00,  0, 3),
(4, 2, 0.00,  0, 3)
ON CONFLICT DO NOTHING;



SELECT 'Seed data inserted successfully!' AS status;
