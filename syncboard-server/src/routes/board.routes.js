import express from 'express';
import { boardController } from '../controllers/board.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateBoardSchema } from '../schemas/board.schema.js';

const router = express.Router();
router.use(protect);

// Fix 2e: Add GET routes for board list and single board
router.get('/', boardController.getAllBoards);
router.get('/:id', boardController.getBoardById);

// Fix 2f: Validate PATCH body against the board schema whitelist
router.patch('/:id', validate(updateBoardSchema), boardController.updateBoard);

export default router;