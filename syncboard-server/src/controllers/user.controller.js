import { userRepository } from '../repositories/user.repository.js';
import asyncHandler from '../utils/asyncHandler.js';

export const userController = {
    searchUsers: asyncHandler(async (req, res) => {
        const { search = '' } = req.query;
        const results = await userRepository.searchByUsername(search, req.user.id);
        res.status(200).json({ status: 'success', data: { users: results } });
    }),
};