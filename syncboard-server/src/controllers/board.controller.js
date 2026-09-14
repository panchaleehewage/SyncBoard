import { boardRepository } from '../repositories/board.repository.js';
import { User } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildMemberProfiles = async (boards) => {
  const allUsernames = [...new Set(boards.flatMap(b => b.members))];
  if (allUsernames.length === 0) return {};
  const users = await User.find({ username: { $in: allUsernames } }).select('username avatar');
  return Object.fromEntries(users.map(u => [u.username, { avatar: u.avatar ?? null }]));
};

const sendInvites = async (req, { boardId, boardTitle, invitedBy, targetUsernames }) => {
  if (!targetUsernames.length) return;
  await User.updateMany(
    {
      username: { $in: targetUsernames },
      'pendingInvites.boardId': { $ne: boardId },
    },
    {
      $push: {
        pendingInvites: { boardId, boardTitle, invitedBy },
      },
    }
  );

  const io = req.app.get('io');
  targetUsernames.forEach(username => {
    io?.to(`user:${username}`).emit('invite:received', { boardId, boardTitle, invitedBy });
  });
};

export const boardController = {
  getAllBoards: asyncHandler(async (req, res) => {
    const boards = await boardRepository.findAllByMember(req.user.username);
    const memberProfiles = await buildMemberProfiles(boards);
    const enriched = boards.map(b => ({ ...b.toJSON(), memberProfiles }));
    res.status(200).json({ status: 'success', data: enriched });
  }),

  getBoardById: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError(`No board found with ID ${req.params.id}`, 404);

    const board = await boardRepository.findById(req.params.id);
    if (!board) throw new AppError(`No board found with ID ${req.params.id}`, 404);

    if (!board.members.includes(req.user.username)) {
      throw new AppError('Forbidden: You are not a member of this board', 403);
    }

    const memberProfiles = await buildMemberProfiles([board]);
    res.status(200).json({ status: 'success', data: { ...board.toJSON(), memberProfiles } });
  }),

  createBoard: asyncHandler(async (req, res) => {
    const { title, columns, tags = [], members = [] } = req.body;
    const leader = req.user.username;

    const invitees = members.filter(m => m !== leader);
    const newBoard = await boardRepository.create({ title, columns, tags, members: [leader], leader });

    if (invitees.length > 0) {
      await sendInvites(req, {
        boardId: newBoard.id,
        boardTitle: newBoard.title,
        invitedBy: leader,
        targetUsernames: invitees,
      });
    }

    res.status(201).json({ status: 'success', data: newBoard });
  }),

  updateBoard: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError(`No board found with ID ${req.params.id}`, 404);

    const board = await boardRepository.findById(req.params.id);
    if (!board) throw new AppError(`No board found with ID ${req.params.id}`, 404);

    if (!board.members.includes(req.user.username)) {
      throw new AppError('Forbidden: You are not a member of this board', 403);
    }

    const { members: incomingMembers, ...fieldUpdates } = req.body;

    const mongoUpdate = {};
    if (Object.keys(fieldUpdates).length > 0) mongoUpdate.$set = fieldUpdates;

    if (incomingMembers) {
      const currentMembers = board.members;

      const newInvitees = incomingMembers.filter(m => !currentMembers.includes(m));
      if (newInvitees.length > 0) {
        await sendInvites(req, {
          boardId: board.id,
          boardTitle: board.title,
          invitedBy: req.user.username,
          targetUsernames: newInvitees,
        });
      }

      const removed = currentMembers.filter(m => !incomingMembers.includes(m) && m !== board.leader);
      if (removed.length > 0) {
        mongoUpdate.$pull = { members: { $in: removed } };
      }
    }

    const updatedBoard = await boardRepository.update(req.params.id, mongoUpdate);
    const memberProfiles = await buildMemberProfiles([updatedBoard]);
    res.status(200).json({ status: 'success', data: { ...updatedBoard.toJSON(), memberProfiles } });
  }),

  deleteBoard: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError(`No board found with ID ${req.params.id}`, 404);

    const board = await boardRepository.findById(req.params.id);
    if (!board) throw new AppError(`No board found with ID ${req.params.id}`, 404);

    if (board.leader !== req.user.username) {
      throw new AppError('Forbidden: Only the board leader can delete this board', 403);
    }
    await boardRepository.delete(req.params.id);

    const io = req.app.get("io");
    io?.to(`board:${req.params.id}`).emit("board:deleted", req.params.id);
    if (board.members) {
      board.members.forEach(member => {
        io?.to(`user:${member}`).emit("board:deleted", req.params.id);
      });
    }

    res.status(204).send();
  }),
};