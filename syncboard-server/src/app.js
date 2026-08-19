import express from 'express';
import AppError from './utils/AppError.js';
import asyncHandler from './utils/asyncHandler.js';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(express.json());

// --- ROUTES ---

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// --- ERROR HANDLING MIDDLEWARE ---

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;