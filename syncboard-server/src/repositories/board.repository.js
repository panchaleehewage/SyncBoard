import { Board } from '../models/board.model.js';

export const boardRepository = {
  async findAll() {
    return await Board.find(); 
  },

  async findById(id) {
    return await Board.findById(id);
  },

  async findAllByMember(username) {
    return await Board.find({ members: username });
  },

  async create(boardData) {
    return await Board.create(boardData);
  },

  async update(id, updates) {
    return await Board.findByIdAndUpdate(id, updates, { new: true });
  }
};