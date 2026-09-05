import { authService } from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { userRepository } from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    const result = await authService.register(email, password, username);
    res.status(201).json({ status: 'success', data: result });
  }),

  login: asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.status(200).json({ status: 'success', data: { user: result.user, token: result.token } });
  }),

  getMe: (req, res) => {
    res.status(200).json({ status: 'success', data: { user: req.user } });
  },

  updateProfile: asyncHandler(async (req, res) => {
    const { bio, avatar, username } = req.body;

    if (username && username !== req.user.username) {
      const existing = await userRepository.findByUsername(username);
      if (existing && existing._id.toString() !== req.user.id) {
        throw new AppError('Username already taken', 409);
      }
    }

    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;
    if (username !== undefined) updates.username = username;

    const updatedUser = await userRepository.update(req.user.id, updates);
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  }),
};