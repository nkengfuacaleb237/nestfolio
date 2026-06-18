const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

const TEST_DB = process.env.MONGO_URI.replace('/nestfolio?', '/nestfolio_test?');

// Store tokens and IDs across tests
let ownerToken;
let otherUserToken;
let propertyId;

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clean slate before each test
  await mongoose.connection.collection('users').deleteMany({});
  await mongoose.connection.collection('properties').deleteMany({});

  // Register owner
  const ownerRes = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'owner',
      email: 'owner@example.com',
      password: 'password123',
    });
  ownerToken = ownerRes.body.token;

  // Register a different user
  const otherRes = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'otheruser',
      email: 'other@example.com',
      password: 'password123',
    });
  otherUserToken = otherRes.body.token;

  // Owner creates a property
  const propRes = await request(app)
    .post('/api/properties')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({
      title: 'Test Apartment',
      description: 'A test property for automated testing.',
      price: 150000,
      location: { city: 'Yaounde', country: 'Cameroon' },
      propertyType: 'Apartment',
      images: [],
    });
  propertyId = propRes.body._id;
});

// ─── PUBLIC FEED ──────────────────────────────────────────────────

describe('GET /api/properties', () => {

  test('returns 200 and array of properties without authentication', async () => {
    const res = await request(app).get('/api/properties');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('filters by city correctly', async () => {
    const res = await request(app)
      .get('/api/properties')
      .query({ city: 'Yaounde' });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].location.city).toBe('Yaounde');
  });

  test('returns empty array when city does not match', async () => {
    const res = await request(app)
      .get('/api/properties')
      .query({ city: 'Buea' });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

});

// ─── PROTECTED ROUTES ─────────────────────────────────────────────

describe('POST /api/properties (authentication required)', () => {

  test('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .post('/api/properties')
      .send({
        title: 'Unauthorized Listing',
        description: 'Should not be created.',
        price: 100000,
        location: { city: 'Douala', country: 'Cameroon' },
        propertyType: 'Studio',
      });

    expect(res.statusCode).toBe(401);
  });

});

// ─── OWNERSHIP CHECKS ─────────────────────────────────────────────

describe('PUT /api/properties/:id (ownership check)', () => {

  test('owner can update their own listing — returns 200', async () => {
    const res = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  test('non-owner gets 403 Forbidden when trying to update', async () => {
    const res = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ title: 'Hacked Title' });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

});

describe('DELETE /api/properties/:id (ownership check)', () => {

  test('non-owner gets 403 Forbidden when trying to delete', async () => {
    const res = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('owner can delete their own listing — returns 200', async () => {
    const res = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.statusCode).toBe(200);
  });

});