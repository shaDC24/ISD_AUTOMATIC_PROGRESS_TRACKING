-- ============================================
-- Udemy Course Management System
-- Instructor Schema
-- CSE 326: ISD Sessional | Group - C1_4
-- ============================================

-- Instructor data is stored in the users table
-- in student-schema.sql with role = 'instructor'
-- No separate tables needed for instructor

-- ============================================
-- INSTRUCTOR ANALYTICS (No separate tables)
-- All analytics are generated on-the-fly from
-- the following tables in student-schema.sql:
-- ============================================

-- 1. VIEW COURSE OVERVIEW
--    Generated from: courses, enrollments
--    Shows: total enrollments, course status

-- 2. VIEW STUDENT PROGRESS
--    Generated from: course_progress, video_progress, users
--    Shows: completion percentage, completed lectures,
--           total lectures, last accessed

-- 3. VIEW ENGAGEMENT METRICS
--    Generated from: video_progress, material_access
--    Shows: watch time, completion rates,
--           material access counts