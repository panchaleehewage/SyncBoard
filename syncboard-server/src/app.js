import express from 'express';
import AppError from './utils/AppError.js';
import asyncHandler from './utils/asyncHandler.js';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware.js';
import taskRoutes from './routes/task.routes.js'; 
import authRoutes from './routes/auth.routes.js';
import boardRoutes from './routes/board.routes.js';

const app = express();

app.use(express.json());

// --- ROUTES ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', uptime: process.uptime(), timestamp: new Date().toISOString() });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/boards', boardRoutes);

// --- ERROR HANDLING MIDDLEWARE ---
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;