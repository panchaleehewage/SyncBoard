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

  // Fix 1d: Pass username (not email) to login service
  login: asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.status(200).json({ status: 'success', data: result });
  }),

  getMe: (req, res) => {
    const { password: _, ...userWithoutPassword } = req.user;
    res.status(200).json({ status: 'success', data: { user: userWithoutPassword } });
  },

  // Fix 1a/1e: Accept bio, avatar (full object), and username changes
  updateProfile: asyncHandler(async (req, res) => {
    const { bio, avatar, username } = req.body;

    // If changing username, ensure it isn't already taken by someone else
    if (username && username !== req.user.username) {
      const existing = await userRepository.findByUsername(username);
      if (existing && existing.id !== req.user.id) {
        throw new AppError('Username already taken', 409);
      }
    }

    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;   // saved as the full { id, gradient, emoji, label } object
    if (username !== undefined) updates.username = username;

    const updatedUser = await userRepository.update(req.user.id, updates);
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ status: 'success', data: { user: userWithoutPassword } });
  }),
};