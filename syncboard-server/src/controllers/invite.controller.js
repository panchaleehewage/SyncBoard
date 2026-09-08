import { User } from '../models/user.model.js';
import { Board } from '../models/board.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const inviteController = {
    /**
     * POST /api/users/invites/:boardId/accept
     * Moves the current user from pendingInvites into Board.members.
     */
    acceptInvite: asyncHandler(async (req, res) => {
        const { boardId } = req.params;
        const username = req.user.username;

        // Verify the invite actually exists for this user
        const user = await User.findById(req.user.id);
        const hasInvite = user.pendingInvites.some(i => i.boardId === boardId);
        if (!hasInvite) throw new AppError('No pending invite for this board', 404);

        // Add user to board members
        await Board.findByIdAndUpdate(boardId, { $addToSet: { members: username } });

        // Remove the invite from user's pendingInvites
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { pendingInvites: { boardId } }
        });

        // Return the updated board so the frontend can add it to state.
        // toJSON() fires the Board transform (_id → id, strip __v).
        const updatedBoard = await Board.findById(boardId);
        if (!updatedBoard) throw new AppError('Board not found', 404);

        res.status(200).json({ status: 'success', data: updatedBoard.toJSON() });
    }),

    /**
     * POST /api/users/invites/:boardId/decline
     * Removes the invite without adding the user to the board.
     */
    declineInvite: asyncHandler(async (req, res) => {
        const { boardId } = req.params;

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { pendingInvites: { boardId } }
        });

        res.status(204).send();
    }),
};
