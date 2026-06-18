const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

// Use a separate test database so real data is never touched
const TEST_DB = process.env.MONGO_URI.replace('/nestfolio?', '/nestfolio_test?');

beforeAll(async () => {
  // Disconnect from the dev database and connect to test database
  await mongoose.disconnect();
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  // Clean up all test data and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Clear users collection before each test so tests don't interfere
beforeEach(async () => {
  await mongoose.connection.collection('users').deleteMany({});
});

// ─── REGISTRATION TESTS ───────────────────────────────────────────

describe('POST /api/auth/register', () => {

  test('returns 201 and a token when valid data is provided', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).not.toHaveProperty('password'); // password must NEVER be returned
  });

  test('returns 400 when email is already in use', async () => {
    // Register once
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'user1',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    // Try to register again with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'user2',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email already in use/i);
  });

  test('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'incomplete@example.com' }); // no username or password

    expect(res.statusCode).toBe(400);
  });

});

// ─── LOGIN TESTS ──────────────────────────────────────────────────

describe('POST /api/auth/login', () => {

  beforeEach(async () => {
    // Create a user to log in with
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123',
      });
  });

  test('returns 200 and a token with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('returns 401 with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  test('returns 401 with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nobody@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(401);
  });

});