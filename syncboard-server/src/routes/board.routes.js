import express from 'express';
import { boardController } from '../controllers/board.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateBoardSchema, createBoardSchema } from '../schemas/board.schema.js';

const router = express.Router();
router.use(protect);

router.get('/', boardController.getAllBoards);
router.get('/:id', boardController.getBoardById);

router.post('/', validate(createBoardSchema), boardController.createBoard);

router.patch('/:id', validate(updateBoardSchema), boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

export default router;