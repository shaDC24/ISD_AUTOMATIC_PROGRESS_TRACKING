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

describe('Video and Course API', () => {
    let token;
    const studentId = 1;

    beforeAll(() => {
        token = jwt.sign({ id: studentId, role: 'student' }, process.env.JWT_SECRET);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/courses/:courseId/lectures', () => {
        it('should return lectures and materials for a course', async () => {
            const courseId = 101;
            
            // Mock course lookup
            pool.query.mockResolvedValueOnce({
                rows: [{ id: courseId, title: 'Test Course', description: 'Test Description' }]
            });

            // Mock lectures lookup
            pool.query.mockResolvedValueOnce({
                rows: [
                    { id: 1, title: 'Lecture 1', video_url: 'url1', duration: 100, position: 1, section_id: 1, section_title: 'S1', section_position: 1 }
                ]
            });

            // Mock materials lookup
            pool.query.mockResolvedValueOnce({
                rows: [
                    { id: 1, title: 'Material 1', file_url: 'file1', file_type: 'pdf', download_allowed: true, section_id: 1 }
                ]
            });

            const res = await request(app)
                .get(`/api/courses/${courseId}/lectures`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('courseId', courseId);
            expect(res.body.lectures).toHaveLength(1);
            expect(res.body.materials).toHaveLength(1);
        });

        it('should return 404 if course not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/courses/999/lectures')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('Video Progress API', () => {
        const lectureId = 1;

        describe('GET /api/video/:lectureId/url', () => {
            it('should return video metadata', async () => {
                pool.query.mockResolvedValueOnce({
                    rows: [{ id: lectureId, title: 'Lecture 1', video_url: 'http://res.cloudinary.com/test/video/upload/v1/video.mp4', duration: 300 }]
                });

                const res = await request(app)
                    .get(`/api/video/${lectureId}/url`)
                    .set('Authorization', `Bearer ${token}`);

                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('url');
                expect(res.body.url).toContain('f_auto,q_auto');
            });

            it('should return 404 when lecture does not exist', async () => {
                pool.query.mockResolvedValueOnce({ rows: [] });

                const res = await request(app)
                    .get(`/api/video/${lectureId}/url`)
                    .set('Authorization', `Bearer ${token}`);

                expect(res.statusCode).toEqual(404);
                expect(res.body).toHaveProperty('message', 'Video not found');
            });
        });

        describe('GET /api/video/last-position/:lectureId', () => {
            it('should return last watched position', async () => {
                pool.query.mockResolvedValueOnce({
                    rows: [{ watch_position: 50.5, completion_percent: 16.8, is_completed: false }]
                });

                const res = await request(app)
                    .get(`/api/video/last-position/${lectureId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('position', 50.5);
            });

            it('should return 0 if no progress found', async () => {
                pool.query.mockResolvedValueOnce({ rows: [] });

                const res = await request(app)
                    .get(`/api/video/last-position/${lectureId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('position', 0);
            });
        });

        describe('POST /api/video/watch-position', () => {
            it('should save watch position', async () => {
                pool.query.mockResolvedValueOnce({ rowCount: 1 });

                const res = await request(app)
                    .post('/api/video/watch-position')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        lectureId: lectureId,
                        position: 100,
                        duration: 500
                    });

                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('message', 'Position saved');
                expect(res.body).toHaveProperty('completion_percent', 20);
            });

            it('should return 400 if missing fields', async () => {
                const res = await request(app)
                    .post('/api/video/watch-position')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        lectureId: lectureId
                        // missing position and duration
                    });

                expect(res.statusCode).toEqual(400);
            });
        });
    });
});
