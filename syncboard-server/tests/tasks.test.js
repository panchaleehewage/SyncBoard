import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup/db.js';
import mongoose from 'mongoose';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Tasks API', () => {
  let token;
  let boardId;
  const fakeId = new mongoose.Types.ObjectId().toString();

  const validTaskPayload = (bId) => ({
    boardId: bId,
    title: 'Complete backend testing',
    status: 'To Do'
  });

  beforeEach(async () => {
    const userRes = await request(app).post('/api/auth/register').send({
      email: 'taskmaster@test.com', password: 'password123', username: 'TaskMaster'
    });
    token = userRes.body.data.token;

    const boardRes = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task Board', columns: [{ label: 'To Do', color: 'blue' }] });
    boardId = boardRes.body.data.id;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(validTaskPayload(boardId));

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.title).toBe('Complete backend testing');
      expect(res.body.data.boardId).toBe(boardId);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Missing Board ID and Status' });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/tasks & GET /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(validTaskPayload(boardId));
      taskId = res.body.data.id;
    });

    it('should fetch all tasks', async () => {
      const res = await request(app)
        .get(`/api/tasks?boardId=${boardId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should fetch a single task by ID', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.title).toBe('Complete backend testing');
    });

    it('should return 404 for an invalid ObjectId format', async () => {
      const res = await request(app)
        .get('/api/tasks/not-a-valid-id')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(validTaskPayload(boardId));
      taskId = res.body.data.id;
    });

    it('should update task details successfully', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Done', title: 'Updated Title' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toBe('Done');
      expect(res.body.data.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(validTaskPayload(boardId));
      taskId = res.body.data.id;
    });

    it('should delete a task successfully', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(204);

      const checkRes = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(checkRes.statusCode).toEqual(404);
    });
  });
});