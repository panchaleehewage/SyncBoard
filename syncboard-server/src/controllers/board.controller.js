import { boardRepository } from '../repositories/board.repository.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const boardController = {
  // Fix 2e: Return all boards the authenticated user is a member of
  getAllBoards: asyncHandler(async (req, res) => {
    const boards = await boardRepository.findAllByMember(req.user.username);
    res.status(200).json({ status: 'success', data: boards });
  }),

  // Fix 2e: Return a single board by id (with membership check)
  getBoardById: asyncHandler(async (req, res) => {
    const board = await boardRepository.findById(req.params.id);
    if (!board) {
      throw new AppError(`No board found with ID ${req.params.id}`, 404);
    }
    if (!board.members.includes(req.user.username)) {
      throw new AppError('Forbidden: You are not a member of this board', 403);
    }
    res.status(200).json({ status: 'success', data: board });
  }),

  // Fix 2f: Body is now pre-validated by updateBoardSchema before reaching here
  updateBoard: asyncHandler(async (req, res) => {
    const board = await boardRepository.findById(req.params.id);
    if (!board) {
      throw new AppError(`No board found with ID ${req.params.id}`, 404);
    }
    if (!board.members.includes(req.user.username)) {
      throw new AppError('Forbidden: You are not a member of this board', 403);
    }
    const updatedBoard = await boardRepository.update(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: updatedBoard });
  }),
};