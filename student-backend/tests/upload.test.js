const request = require('supertest');
const jwt = require('jsonwebtoken');
const pool = require('../src/db');
const cloudinary = require('../src/config/cloudinary');

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
jest.mock('../src/config/cloudinary', () => ({
    uploader: {
        destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
        upload_stream: jest.fn()
    }
}));

// Mock upload middleware to bypass real Cloudinary calls
jest.mock('../src/middleware/upload.middleware', () => ({
    ...jest.requireActual('../src/middleware/upload.middleware'),
    uploadToCloudinary: jest.fn().mockResolvedValue({
        secure_url: 'https://res.cloudinary.com/test/item.mp4',
        duration: 120
    })
}));

const app = require('../src/index');
const { uploadToCloudinary } = require('../src/middleware/upload.middleware');

describe('Upload API', () => {
    let token;
    const instructorId = 1;

    beforeAll(() => {
        token = jwt.sign({ id: instructorId, role: 'instructor' }, process.env.JWT_SECRET);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/upload/video', () => {
        /**
         * Test Case: Video Upload
         * Verifies that multipart video uploads correctly call Cloudinary and save to DB.
         */
        it('should upload a video successfully', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, title: 'New Video', video_url: 'url', duration: 120 }]
            });

            const res = await request(app)
                .post('/api/upload/video')
                .set('Authorization', `Bearer ${token}`)
                .field('sectionId', '10')
                .field('title', 'New Video')
                .attach('file', Buffer.from('mock video data'), 'test.mp4');

            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Video uploaded successfully');
            expect(uploadToCloudinary).toHaveBeenCalled();
        });

        it('should return 400 if no file is provided', async () => {
            const res = await request(app)
                .post('/api/upload/video')
                .set('Authorization', `Bearer ${token}`)
                .field('sectionId', '10')
                .field('title', 'New Video');

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/upload/material', () => {
        /**
         * Test Case: Material Upload
         * Verifies that multipart material (PDF/ZIP) uploads work correctly.
         */
        it('should upload material successfully', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, title: 'Docs', file_url: 'url', file_type: 'application/pdf' }]
            });

            const res = await request(app)
                .post('/api/upload/material')
                .set('Authorization', `Bearer ${token}`)
                .field('sectionId', '10')
                .field('title', 'Docs')
                .attach('file', Buffer.from('mock pdf data'), 'test.pdf');

            expect(res.statusCode).toEqual(201);
            expect(res.body.material.title).toBe('Docs');
        });
    });

    describe('DELETE /api/upload/video/:lectureId', () => {
        it('should delete a video successfully', async () => {
            const lectureId = 1;
            pool.query.mockResolvedValueOnce({
                rows: [{ video_url: 'http://res.cloudinary.com/test/video/upload/udemy_videos/test.mp4' }]
            });
            pool.query.mockResolvedValueOnce({ rowCount: 1 });

            const res = await request(app)
                .delete(`/api/upload/video/${lectureId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Video deleted successfully');
            expect(cloudinary.uploader.destroy).toHaveBeenCalled();
        });

        it('should return 404 if lecture not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .delete('/api/upload/video/999')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
        });
    });
});
