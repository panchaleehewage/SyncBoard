import { User } from '../models/user.model.js';
import { Board } from '../models/board.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const inviteController = {
    acceptInvite: asyncHandler(async (req, res) => {
        const { boardId } = req.params;
        const username = req.user.username;

        const user = await User.findById(req.user.id);
        const hasInvite = user.pendingInvites.some(i => i.boardId === boardId);
        if (!hasInvite) throw new AppError('No pending invite for this board', 404);

        await Board.findByIdAndUpdate(boardId, { $addToSet: { members: username } });

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { pendingInvites: { boardId } }
        });

        const updatedBoard = await Board.findById(boardId);
        if (!updatedBoard) throw new AppError('Board not found', 404);

        res.status(200).json({ status: 'success', data: updatedBoard.toJSON() });
    }),

    declineInvite: asyncHandler(async (req, res) => {
        const { boardId } = req.params;

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { pendingInvites: { boardId } }
        });

        res.status(204).send();
    }),
};
