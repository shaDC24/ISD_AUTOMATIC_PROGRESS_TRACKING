const request = require('supertest');
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

// Mock cloudinary as it's required by the app
jest.mock('cloudinary', () => ({
    v2: {
        config: jest.fn(),
        uploader: {
            upload_stream: jest.fn()
        }
    }
}));

const app = require('../src/index');

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            // Mock existing user check
            pool.query.mockResolvedValueOnce({ rows: [] });
            
            // Mock saving user
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, name: 'Test User', email: 'test@example.com', role: 'student' }]
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'student'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should return 400 if email is already registered', async () => {
            // Mock existing user found
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, email: 'test@example.com' }]
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'student'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Email already registered');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('password123', 10);

            // Mock user lookup
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    password: hashedPassword,
                    role: 'student'
                }]
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should return 400 with incorrect credentials', async () => {
            // Mock user not found or wrong password
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should return 400 when password does not match', async () => {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('correctpassword', 10);

            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    password: hashedPassword,
                    role: 'student'
                }]
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });
    });
});
