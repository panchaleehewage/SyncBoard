import express from 'express';
import AppError from './utils/AppError.js';
import asyncHandler from './utils/asyncHandler.js';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware.js';
import taskRoutes from './routes/task.routes.js';
import authRoutes from './routes/auth.routes.js';
import boardRoutes from './routes/board.routes.js';
import userRoutes from './routes/user.routes.js';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

// --- ROUTES ---
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  
  res.status(200).json({ 
    status: 'success', 
    uptime: process.uptime(), 
    dbState: states[dbState] || 'unknown'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/users', userRoutes);

// --- ERROR HANDLING MIDDLEWARE ---
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;