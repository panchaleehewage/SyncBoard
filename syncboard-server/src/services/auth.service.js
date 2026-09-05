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
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError('Email already in use', 409);
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new AppError('Username already taken', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userRepository.create({
      email,
      password: hashedPassword,
      username,
    });

    const safeUser = newUser.toJSON();
    const token = signToken(safeUser.id);

    return { user: safeUser, token };
  },

  async login(username, password) {
    const user = await userRepository.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Incorrect username or password', 401);
    }

    const safeUser = user.toJSON();
    const token = signToken(safeUser.id);

    return { user: safeUser, token };
  }
};