import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup/db.js';
import mongoose from 'mongoose';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Boards API', () => {
  let leaderToken, otherUserToken;
  const fakeId = new mongoose.Types.ObjectId().toString();

  const validBoardPayload = {
    title: 'Project Alpha',
    columns: [{ label: 'To Do', color: 'violet' }],
    tags: [{ label: 'Urgent', color: 'red' }]
  };

  beforeEach(async () => {
    const res1 = await request(app).post('/api/auth/register').send({
      email: 'leader@test.com', password: 'password123', username: 'LeaderUser'
    });
    leaderToken = res1.body.data.token;

    const res2 = await request(app).post('/api/auth/register').send({
      email: 'other@test.com', password: 'password123', username: 'OtherUser'
    });
    otherUserToken = res2.body.data.token;
  });

  describe('POST /api/boards', () => {
    it('should create a board and assign the creator as leader and member', async () => {
      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${leaderToken}`)
        .send(validBoardPayload);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.title).toBe(validBoardPayload.title);
      expect(res.body.data.leader).toBe('LeaderUser');
      expect(res.body.data.members).toContain('LeaderUser');
    });

    it('should return 400 if validation fails (missing columns)', async () => {
      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${leaderToken}`)
        .send({ title: 'No Columns Board' });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/boards & GET /api/boards/:id', () => {
    let boardId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${leaderToken}`)
        .send(validBoardPayload);
      boardId = res.body.data.id;
    });

    it('should fetch all boards for the logged-in user', async () => {
      const res = await request(app)
        .get('/api/boards')
        .set('Authorization', `Bearer ${leaderToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe(boardId);
    });

    it('should fetch a single board by ID', async () => {
      const res = await request(app)
        .get(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${leaderToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.title).toBe(validBoardPayload.title);
    });

    it('should return 403 if user is not a member of the board', async () => {
      const res = await request(app)
        .get(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.statusCode).toEqual(403);
    });

    it('should return 404 for an invalid ObjectId format', async () => {
      const res = await request(app)
        .get('/api/boards/invalid-string-123')
        .set('Authorization', `Bearer ${leaderToken}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PATCH /api/boards/:id', () => {
    let boardId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${leaderToken}`)
        .send(validBoardPayload);
      boardId = res.body.data.id;
    });

    it('should update the board successfully', async () => {
      const res = await request(app)
        .patch(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${leaderToken}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('should return 403 if a non-member tries to update the board', async () => {
      const res = await request(app)
        .patch(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ title: 'Hacked Title' });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('DELETE /api/boards/:id', () => {
    let boardId;

    beforeEach(async () => {
      const payloadWithMember = { ...validBoardPayload, members: ['OtherUser'] };
      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${leaderToken}`)
        .send(payloadWithMember);
      boardId = res.body.data.id;
    });

    it('should return 403 if a member (not leader) tries to delete the board', async () => {
      const res = await request(app)
        .delete(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it('should delete the board successfully if requested by the leader', async () => {
      const res = await request(app)
        .delete(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${leaderToken}`);

      expect(res.statusCode).toEqual(204);

      const checkRes = await request(app)
        .get(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${leaderToken}`);
      expect(checkRes.statusCode).toEqual(404);
    });
  });
});