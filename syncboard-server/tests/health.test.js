import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB } from './setup/db.js';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());

describe('Health Check API', () => {
  it('should return 200 and success status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
  });
});