/**
 * tests/videoController.test.js
 * Unit + Integration tests for Shatabdi's video API
 *
 * Run: npm test
 * Install: npm install --save-dev jest supertest
 */

const request = require('supertest');
const express = require('express');
const jwt     = require('jsonwebtoken');

// Mock the DB pool so tests don't need real PostgreSQL
jest.mock('../src/db', () => ({
    query: jest.fn(),
}));

const pool = require('../src/db');
const app  = require('../src/index'); // your express app

// Helper: generate a valid JWT token for tests
const makeToken = (userId = 2, role = 'student') =>
    jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'mysecretjwtkey123');

const authHeader = () => ({ Authorization: `Bearer ${makeToken()}` });

// ─────────────────────────────────────────────────────────────────────────────
// Unit Tests: GET /api/video/:lectureId/url
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/video/:lectureId/url', () => {

    test('returns video data when lecture exists', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{
                id:       1,
                title:    'Chapter 1 - Lecture 1',
                video_url:'https://res.cloudinary.com/test/video.mp4',
                duration: '599',
            }]
        });

        const res = await request(app)
            .get('/api/video/1/url')
            .set(authHeader());

        expect(res.status).toBe(200);
        expect(res.body.lectureId).toBe(1);
        expect(res.body.url).toContain('cloudinary.com');
        expect(res.body.duration).toBe(599);
    });

    test('returns 404 when lecture not found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get('/api/video/999/url')
            .set(authHeader());

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Video not found');
    });

    test('returns 401 without token', async () => {
        const res = await request(app).get('/api/video/1/url');
        expect(res.status).toBe(401);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Unit Tests: GET /api/video/last-position/:lectureId
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/video/last-position/:lectureId', () => {

    test('returns 0 for first-time viewer', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] }); // no row in DB

        const res = await request(app)
            .get('/api/video/last-position/1')
            .set(authHeader());

        expect(res.status).toBe(200);
        expect(res.body.position).toBe(0);
        expect(res.body.is_completed).toBe(false);
    });

    test('returns saved position for returning viewer', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{
                watch_position:    '280.00',
                completion_percent:'46.91',
                is_completed:      false,
            }]
        });

        const res = await request(app)
            .get('/api/video/last-position/1')
            .set(authHeader());

        expect(res.status).toBe(200);
        expect(res.body.position).toBe(280);
        expect(res.body.completion_percent).toBeCloseTo(46.91);
    });

    test('returns is_completed true when lecture finished', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{
                watch_position:    '599.00',
                completion_percent:'100.00',
                is_completed:      true,
            }]
        });

        const res = await request(app)
            .get('/api/video/last-position/1')
            .set(authHeader());

        expect(res.status).toBe(200);
        expect(res.body.is_completed).toBe(true);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Unit Tests: POST /api/video/watch-position
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/video/watch-position', () => {

    test('saves position and returns completion percent', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] }); // upsert success

        const res = await request(app)
            .post('/api/video/watch-position')
            .set(authHeader())
            .send({ lectureId: 1, position: 120, duration: 599 });

        expect(res.status).toBe(200);
        expect(res.body.position).toBe(120);
        expect(res.body.completion_percent).toBeCloseTo(20.03, 1);
    });

    test('returns 400 when body is missing fields', async () => {
        const res = await request(app)
            .post('/api/video/watch-position')
            .set(authHeader())
            .send({ lectureId: 1 }); // missing position and duration

        expect(res.status).toBe(400);
    });

    test('caps completion_percent at 100', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .post('/api/video/watch-position')
            .set(authHeader())
            .send({ lectureId: 1, position: 600, duration: 599 }); // position > duration

        expect(res.status).toBe(200);
        expect(res.body.completion_percent).toBe(100);
    });

    test('returns 401 without token', async () => {
        const res = await request(app)
            .post('/api/video/watch-position')
            .send({ lectureId: 1, position: 100, duration: 599 });

        expect(res.status).toBe(401);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Test: Full resume flow
// ─────────────────────────────────────────────────────────────────────────────
describe('Resume flow (integration)', () => {

    test('save position → fetch → same position returned', async () => {
        // Step 1: save position at 300s
        pool.query.mockResolvedValueOnce({ rows: [] });
        await request(app)
            .post('/api/video/watch-position')
            .set(authHeader())
            .send({ lectureId: 1, position: 300, duration: 599 });

        // Step 2: fetch last position — should return 300
        pool.query.mockResolvedValueOnce({
            rows: [{
                watch_position:    '300.00',
                completion_percent:'50.08',
                is_completed:      false,
            }]
        });

        const res = await request(app)
            .get('/api/video/last-position/1')
            .set(authHeader());

        expect(res.body.position).toBe(300);
    });
});
