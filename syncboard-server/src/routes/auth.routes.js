import express from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: { status: 'fail', message: 'Too many login attempts, please try again after 15 minutes' }
});

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.get('/me', protect, authController.getMe);
router.patch('/me', protect, authController.updateProfile);

export default router;