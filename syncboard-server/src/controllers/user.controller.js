import { userRepository } from '../repositories/user.repository.js';
import { Task } from '../models/task.model.js';
import { Board } from '../models/board.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const userController = {
    searchUsers: asyncHandler(async (req, res) => {
        const { search = '' } = req.query;
        const results = await userRepository.searchByUsername(search, req.user.id);
        res.status(200).json({ status: 'success', data: { users: results } });
    }),

    getProfile: asyncHandler(async (req, res) => {
        const { username } = req.params;

        const targetUser = await userRepository.findByUsername(username);
        if (!targetUser) throw new AppError('User not found', 404);

        // Count tasks assigned to this user with status 'Done'
        const tasksCompleted = await Task.countDocuments({
            assignee: username,
            status: 'Done',
        });

        // Count boards where both the viewer and target user are members
        const boardsCount = await Board.countDocuments({
            members: { $all: [req.user.username, username] },
        });

        res.status(200).json({
            status: 'success',
            data: {
                username: targetUser.username,
                bio: targetUser.bio || '',
                avatar: targetUser.avatar || null,
                tasksCompleted,
                boardsCount,
            },
        });
    }),
};