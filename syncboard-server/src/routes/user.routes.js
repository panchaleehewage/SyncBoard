import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/users?search=query — search users by username (authenticated)
router.get('/', protect, userController.searchUsers);

export default router;
