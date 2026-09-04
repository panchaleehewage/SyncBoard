import { taskRepository } from '../repositories/task.repository.js';
import { boardRepository } from '../repositories/board.repository.js';
import AppError from '../utils/AppError.js';

// Helper function to enforce authorization rules
const enforceBoardAccess = async (boardId, username) => {
  const board = await boardRepository.findById(boardId);
  if (!board) throw new AppError(`No board found with ID ${boardId}`, 404);

  if (!board.members.includes(username)) {
    throw new AppError('Forbidden: You do not have access to this board', 403);
  }
};

export const taskService = {
  async getTasks(query = {}, currentUser) {
    let tasks = await taskRepository.findAll();

    // AUTHORIZATION: Only return tasks for boards this user is a member of
    const userBoards = await boardRepository.findAllByMember(currentUser.username);
    const userBoardIds = userBoards.map(b => b.id);
    tasks = tasks.filter(t => userBoardIds.includes(t.boardId));

    // 1. Filtering
    if (query.status) tasks = tasks.filter(t => t.status.toLowerCase() === query.status.toLowerCase());
    if (query.assignee) tasks = tasks.filter(t => t.assignee.toLowerCase() === query.assignee.toLowerCase());

    // 2. Sorting
    if (query.sort) tasks.sort((a, b) => (a[query.sort] > b[query.sort] ? 1 : -1));

    // 3. Pagination (only applied when client explicitly requests it)
    if (query.page || query.limit) {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      return tasks.slice((page - 1) * limit, page * limit);
    }

    return tasks;
  },

  async getTaskById(id, currentUser) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError(`No task found with ID ${id}`, 404);

    await enforceBoardAccess(task.boardId, currentUser.username);
    return task;
  },

  async createTask(taskData, currentUser) {
    await enforceBoardAccess(taskData.boardId, currentUser.username);
    return await taskRepository.create(taskData);
  },

  async updateTask(id, updates, currentUser) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError(`No task found with ID ${id}`, 404);

    await enforceBoardAccess(task.boardId, currentUser.username);
    return await taskRepository.update(id, updates);
  },

  async deleteTask(id, currentUser) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError(`No task found with ID ${id}`, 404);

    await enforceBoardAccess(task.boardId, currentUser.username);
    return await taskRepository.delete(id);
  }
};