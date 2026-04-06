const request = require('supertest');
const jwt = require('jsonwebtoken');
const pool = require('../src/db');

// Set environment variables for testing
process.env.JWT_SECRET = 'mysecretjwtkey123';
process.env.JWT_EXPIRES_IN = '1h';

// Mock database
jest.mock('../src/db', () => ({
    query: jest.fn(),
    connect: jest.fn((cb) => cb && cb(null)),
    on: jest.fn()
}));

// Mock cloudinary
jest.mock('cloudinary', () => ({
    v2: {
        config: jest.fn(),
        uploader: {
            upload_stream: jest.fn()
        }
    }
}));

const app = require('../src/index');

describe('Progress API', () => {
    let token;
    const studentId = 1;

    beforeAll(() => {
        token = jwt.sign({ id: studentId, role: 'student' }, process.env.JWT_SECRET);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/progress/:courseId', () => {
        it('should return 401 without Authorization header', async () => {
            const res = await request(app).get('/api/progress/101');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'No token provided');
        });

        it('should return course progress', async () => {
            const courseId = 101;
            pool.query.mockResolvedValueOnce({
                rows: [{ student_id: studentId, course_id: courseId, completion_percentage: 50 }]
            });

            const res = await request(app)
                .get(`/api/progress/${courseId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('completion_percentage', 50);
        });
    });

    describe('GET /api/progress/enrolled/courses', () => {
        /**
         * Test Case: Enrolled Courses
         * Verifies that the list of courses the student is enrolled in is returned with progress.
         */
        it('should return list of enrolled courses with progress', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [
                    { id: 1, title: 'Course 1', completion_percentage: 20 },
                    { id: 2, title: 'Course 2', completion_percentage: 0 }
                ]
            });

            const res = await request(app)
                .get('/api/progress/enrolled/courses')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty('title', 'Course 1');
        });
    });

    describe('GET /api/progress/weekly/stats', () => {
        /**
         * Test Case: Weekly Stats
         * Verifies that learning activity for the last 7 days is returned.
         */
        it('should return weekly learning statistics', async () => {
            const today = new Date().toISOString().split('T')[0];
            pool.query.mockResolvedValueOnce({
                rows: [{ day: today, completed: 5 }]
            });

            const res = await request(app)
                .get('/api/progress/weekly/stats')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body[0]).toHaveProperty('completed', 5);
        });
    });

    describe('GET /api/progress/lectures/:courseId', () => {
        it('should return lessons progress for a course', async () => {
            const courseId = 101;
            pool.query.mockResolvedValueOnce({
                rows: [{ lecture_id: 1, is_completed: true }]
            });

            const res = await request(app)
                .get(`/api/progress/lectures/${courseId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body.lectures)).toBe(true);
            expect(res.body.lectures[0]).toHaveProperty('is_completed', true);
        });
    });

    describe('POST /api/progress/complete', () => {
        it('should mark a lesson as complete', async () => {
            // Mock multiple database calls in the controller
            pool.query.mockResolvedValue({ 
                rows: [{ done: 1, total_lectures: 10 }],
                rowCount: 1 
            });

            const res = await request(app)
                .post('/api/progress/complete')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    lectureId: 1,
                    courseId: 101,
                    percentage: 100
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Lesson marked as complete');
        });
    });
});
