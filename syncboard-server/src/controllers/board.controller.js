import { boardRepository } from '../repositories/board.repository.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const boardController = {
  getAllBoards: asyncHandler(async (req, res) => {
    const boards = await boardRepository.findAllByMember(req.user.username);
    res.status(200).json({ status: 'success', data: boards });
  }),

  getBoardById: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError(404, `No board found with ID ${req.params.id}`);

    const board = await boardRepository.findById(req.params.id);
    if (!board) throw new AppError(404, `No board found with ID ${req.params.id}`);

    if (!board.members.includes(req.user.username)) {
      throw new AppError(403, 'Forbidden: You are not a member of this board');
    }
    res.status(200).json({ status: 'success', data: board });
  }),

  createBoard: asyncHandler(async (req, res) => {
    const { title, columns, tags = [], members = [] } = req.body;
    const leader = req.user.username;
    const finalMembers = members.includes(leader) ? members : [leader, ...members];
    const newBoard = await boardRepository.create({ title, columns, tags, members: finalMembers, leader });
    res.status(201).json({ status: 'success', data: newBoard });
  }),

  updateBoard: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError(404, `No board found with ID ${req.params.id}`);

    const board = await boardRepository.findById(req.params.id);
    if (!board) throw new AppError(404, `No board found with ID ${req.params.id}`);

    if (!board.members.includes(req.user.username)) {
      throw new AppError(403, 'Forbidden: You are not a member of this board');
    }
    const updatedBoard = await boardRepository.update(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: updatedBoard });
  }),

  deleteBoard: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError(404, `No board found with ID ${req.params.id}`);

    const board = await boardRepository.findById(req.params.id);
    if (!board) throw new AppError(404, `No board found with ID ${req.params.id}`);

    if (board.leader !== req.user.username) {
      throw new AppError(403, 'Forbidden: Only the board leader can delete this board');
    }
    await boardRepository.delete(req.params.id);
    res.status(204).send();
  }),
};