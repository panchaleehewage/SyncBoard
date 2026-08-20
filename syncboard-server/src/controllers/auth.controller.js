import { authService } from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    
    const result = await authService.register(email, password, username);
    
    res.status(201).json({ status: 'success', data: result });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const result = await authService.login(email, password);
    
    res.status(200).json({ status: 'success', data: result });
  }),

  getMe: (req, res) => {
    const { password: _, ...userWithoutPassword } = req.user;
    res.status(200).json({ status: 'success', data: { user: userWithoutPassword } });
  }
};