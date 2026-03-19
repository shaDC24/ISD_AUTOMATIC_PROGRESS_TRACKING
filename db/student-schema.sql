-- ============================================
-- Udemy Course Management System
-- Student Schema
-- CSE 326: ISD Sessional | Group - C1_4
-- ============================================

DROP TABLE IF EXISTS material_access CASCADE;
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS video_progress CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS video_lectures CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor')),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. COURSES
-- ============================================
CREATE TABLE courses (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    instructor_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    thumbnail_url   VARCHAR(500),
    is_free         BOOLEAN DEFAULT FALSE,
    price           NUMERIC(10, 2) DEFAULT 0.00,
    status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. SECTIONS
-- ============================================
CREATE TABLE sections (
    id          SERIAL PRIMARY KEY,
    course_id   INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    position    INT NOT NULL DEFAULT 1,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. VIDEO LECTURES
-- ============================================
CREATE TABLE video_lectures (
    id          SERIAL PRIMARY KEY,
    section_id  INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    video_url   VARCHAR(500) NOT NULL,
    duration    NUMERIC(10, 2) NOT NULL DEFAULT 0,
    position    INT NOT NULL DEFAULT 1,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. MATERIALS
-- ============================================
CREATE TABLE materials (
    id                  SERIAL PRIMARY KEY,
    section_id          INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title               VARCHAR(200) NOT NULL,
    file_url            VARCHAR(500) NOT NULL,
    file_type           VARCHAR(50),
    download_allowed    BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. ENROLLMENTS
-- ============================================
CREATE TABLE enrollments (
    id          SERIAL PRIMARY KEY,
    student_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id   INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);

-- ============================================
-- 7. VIDEO PROGRESS
-- ============================================
CREATE TABLE video_progress (
    id                  SERIAL PRIMARY KEY,
    student_id          INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lecture_id          INT NOT NULL REFERENCES video_lectures(id) ON DELETE CASCADE,
    watch_position      NUMERIC(10, 2) DEFAULT 0,
    completion_percent  NUMERIC(5, 2) DEFAULT 0,
    is_completed        BOOLEAN DEFAULT FALSE,
    last_updated        TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, lecture_id)
);

-- ============================================
-- 8. COURSE PROGRESS
-- ============================================
CREATE TABLE course_progress (
    id                      SERIAL PRIMARY KEY,
    student_id              INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id               INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    completion_percentage   NUMERIC(5, 2) DEFAULT 0,
    completed_lectures      INT DEFAULT 0,
    total_lectures          INT DEFAULT 0,
    last_accessed           TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);

-- ============================================
-- 9. MATERIAL ACCESS
-- ============================================
CREATE TABLE material_access (
    id              SERIAL PRIMARY KEY,
    student_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id     INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    accessed_at     TIMESTAMP DEFAULT NOW()
);