import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

export const authService = {
  async register(email, password, username) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userRepository.create({ 
      email, 
      password: hashedPassword, 
      username 
    });

    const { password: _, ...userWithoutPassword } = newUser;

    const token = signToken(newUser.id);

    return { user: userWithoutPassword, token };
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = signToken(user.id);

    return { user: userWithoutPassword, token };
  }
};