import { User } from '../models/user.model.js';
import AppError from '../utils/AppError.js';

export const userRepository = {
  async findByEmail(email) {
    return await User.findOne({ email });
  },

  async findByUsername(username) {
    return await User.findOne({ username });
  },

  async findById(id) {
    return await User.findById(id);
  },

  async create(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError(409, 'Username or email already exists');
      }
      throw error;
    }
  },

  async update(id, updates) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  },

  async searchByUsername(query, excludeId) {
    const q = (query || '').toLowerCase();
    return await User.find({
      _id: { $ne: excludeId },
      username: { $regex: q, $options: 'i' } 
    });
  }
};