import { taskRepository } from '../repositories/task.repository.js';
import AppError from '../utils/AppError.js';

export const taskService = {
  async getTasks(query = {}) {
    let tasks = await taskRepository.findAll();

    // 1. Filtering
    if (query.status) {
      tasks = tasks.filter(t => t.status.toLowerCase() === query.status.toLowerCase());
    }
    if (query.assignee) {
      tasks = tasks.filter(t => t.assignee.toLowerCase() === query.assignee.toLowerCase());
    }

    // 2. Sorting
    if (query.sort) {
      tasks.sort((a, b) => (a[query.sort] > b[query.sort] ? 1 : -1));
    }

    // 3. Pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return tasks.slice(startIndex, endIndex);
  },

  async getTaskById(id) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError(`No task found with ID ${id}`, 404);
    return task;
  },

  async createTask(taskData) {
    return await taskRepository.create(taskData);
  },

  async updateTask(id, updates) {
    const task = await taskRepository.update(id, updates);
    if (!task) throw new AppError(`No task found with ID ${id}`, 404);
    return task;
  },

  async deleteTask(id) {
    const success = await taskRepository.delete(id);
    if (!success) throw new AppError(`No task found with ID ${id}`, 404);
    return true;
  }
};