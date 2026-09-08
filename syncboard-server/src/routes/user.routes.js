import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { inviteController } from '../controllers/invite.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/users?search=query — search users by username (authenticated)
router.get('/', protect, userController.searchUsers);

// POST /api/users/invites/:boardId/accept  — accept a board invite
// POST /api/users/invites/:boardId/decline — decline a board invite
router.post('/invites/:boardId/accept', protect, inviteController.acceptInvite);
router.post('/invites/:boardId/decline', protect, inviteController.declineInvite);

export default router;
