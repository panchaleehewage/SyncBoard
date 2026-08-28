import { Task } from '../models/task.model.js';

export const taskRepository = {
  async findAll() {
    return await Task.find();
  },

  async findById(id) {
    return await Task.findById(id);
  },

  async create(taskData) {
    const { id, ...rest } = taskData;
    return await Task.create(rest);
  },

  async update(id, updates) {
    return await Task.findByIdAndUpdate(id, updates, { new: true });
  },

  async delete(id) {
    const result = await Task.findByIdAndDelete(id);
    return !!result;
  }
};