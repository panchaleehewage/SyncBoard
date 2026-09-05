import { taskService } from '../services/task.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const taskController = {
  getAllTasks: asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasks(req.query, req.user);
    res.status(200).json({ status: 'success', data: tasks });
  }),

  getTaskById: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError('Task not found', 404);
    const task = await taskService.getTaskById(req.params.id, req.user);
    res.status(200).json({ status: 'success', data: task });
  }),

  createTask: asyncHandler(async (req, res) => {
    const newTask = await taskService.createTask(req.body, req.user);
    res.status(201).json({ status: 'success', data: newTask });
  }),

  updateTask: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError('Task not found', 404);
    const updatedTask = await taskService.updateTask(req.params.id, req.body, req.user);
    res.status(200).json({ status: 'success', data: updatedTask });
  }),

  deleteTask: asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw new AppError('Task not found', 404);
    await taskService.deleteTask(req.params.id, req.user);
    res.status(204).send();
  })
};