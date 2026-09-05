import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup/db.js';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Auth API', () => {
  const testUser = {
    email: 'studentdev@syncboard.com',
    password: 'Password123!',
    username: 'StudentDev'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.user.username).toBe(testUser.username);
    });

    it('should return 409 if username or email already exists', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.statusCode).toEqual(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 401 with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: 'WrongPassword' });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET & PATCH /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      token = res.body.data.token;
    });

    it('should fetch the current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.user.username).toBe(testUser.username);
    });

    it('should update the user bio successfully', async () => {
      const newBio = 'Updating my bio for testing';
      const res = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ bio: newBio });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.user.bio).toBe(newBio);
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toEqual(401);
    });
  });
});