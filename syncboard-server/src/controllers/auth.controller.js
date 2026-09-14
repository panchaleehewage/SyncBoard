import { authService } from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { userRepository } from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const signToken = (id) =>
  jwt.sign({ id }, config.jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

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

  googleAuth: asyncHandler(async (req, res) => {
    const { email, name, sub: googleId } = req.body;
    if (!email || !googleId) {
      throw new AppError('Google user info (email, sub) is required', 400);
    }

    // Find or create user
    let user = await userRepository.findOne({ googleId });
    if (!user) {
      user = await userRepository.findByEmail(email);
      if (user) {
        // Link Google ID to existing email account
        user = await userRepository.update(user._id.toString(), { googleId });
      } else {
        // Brand-new user from Google — derive a unique username
        const baseUsername = (name || email.split('@')[0])
          .replace(/\s+/g, '')
          .slice(0, 20);
        let username = baseUsername;
        let suffix = 1;
        while (await userRepository.findByUsername(username)) {
          username = `${baseUsername}${suffix++}`;
        }
        user = await userRepository.create({ email, username, googleId, password: '' });
      }
    }

    const safeUser = user.toJSON ? user.toJSON() : user;
    const token = signToken(safeUser.id);
    res.status(200).json({ status: 'success', data: { user: safeUser, token } });
  }),
};