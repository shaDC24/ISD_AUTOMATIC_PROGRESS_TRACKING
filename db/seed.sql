-- ============================================
-- Udemy Course Management System
-- Seed Data
-- CSE 326: ISD Sessional | Group - C1_4
-- ============================================

-- ============================================
-- 1. USERS (2 instructors + 6 students)
-- All users have password: password123
-- ============================================
INSERT INTO users (name, email, password, role) VALUES
('Instructor Karim',  'karim@test.com',     '$2b$10$gI.t15wmKBb4BW5UiTGZGeVz78aMovK/PfHeQD5HDL9mV4g5dOQIu', 'instructor'),
('Instructor Nadia',  'nadia@test.com',     '$2b$10$gI.t15wmKBb4BW5UiTGZGeVz78aMovK/PfHeQD5HDL9mV4g5dOQIu', 'instructor'),
('Shatabdi',         'shatabdi@test.com',   '$2b$10$gI.t15wmKBb4BW5UiTGZGeVz78aMovK/PfHeQD5HDL9mV4g5dOQIu', 'student'),
('Shadman',          'shadman@test.com',    '$2b$10$gI.t15wmKBb4BW5UiTGZGeVz78aMovK/PfHeQD5HDL9mV4g5dOQIu', 'student'),
('Tanmi',            'tanmi@test.com',      '$2b$10$gI.t15wmKBb4BW5UiTGZGeVz78aMovK/PfHeQD5HDL9mV4g5dOQIu', 'student'),
('Arpita',           'arpita@test.com',     '$2b$10$gI.t15wmKBb4BW5UiTGZGeVz78aMovK/PfHeQD5HDL9mV4g5dOQIu', 'student'),
('Tamanna',          'tamanna@test.com',    '$2b$10$gI.t15wmKBb4BW5UiTGZGeVz78aMovK/PfHeQD5HDL9mV4g5dOQIu', 'student'),
('Niaz',             'niaz@test.com',       '$2b$10$gI.t15wmKBb4BW5UiTGZGeVz78aMovK/PfHeQD5HDL9mV4g5dOQIu', 'student');

-- ============================================
-- NOTE: The following tables need real data
-- inserted by the respective team members:
-- ============================================

-- courses table:
-- INSERT INTO courses (title, description, instructor_id, is_free, price, status) VALUES (...)
-- Add real courses here

-- sections table:
-- INSERT INTO sections (course_id, title, position) VALUES (...)
-- Add real course sections here

-- video_lectures table:
-- INSERT INTO video_lectures (section_id, title, video_url, duration, position) VALUES (...)
-- Add real video lectures here

-- materials table:
-- INSERT INTO materials (section_id, title, file_url, file_type, download_allowed) VALUES (...)
-- Add real course materials here

-- enrollments table:
-- INSERT INTO enrollments (student_id, course_id) VALUES (...)
-- Add after courses are populated

-- video_progress table:
-- INSERT INTO video_progress (student_id, lecture_id, watch_position, completion_percent, is_completed) VALUES (...)
-- Add after video_lectures are populated

-- course_progress table:
-- INSERT INTO course_progress (student_id, course_id, completion_percentage, completed_lectures, total_lectures) VALUES (...)
-- Add after video_lectures are populated

-- material_access table:
-- INSERT INTO material_access (student_id, material_id) VALUES (...)
-- Add after materials are populated