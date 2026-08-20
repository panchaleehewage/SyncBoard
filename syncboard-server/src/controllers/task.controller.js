import { taskService } from '../services/task.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const taskController = {
  // GET /api/tasks
  getAllTasks: asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasks(req.query);
    res.status(200).json({ status: 'success', data: tasks });
  }),

  // GET /api/tasks/:id
  getTaskById: asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json({ status: 'success', data: task });
  }),

  // POST /api/tasks
  createTask: asyncHandler(async (req, res) => {
    console.log("POST request reached the controller! Body:", req.body); // <--- ADD THIS LINE
    
    const newTask = await taskService.createTask(req.body);
    res.status(201).json({ status: 'success', data: newTask });
  }),

  // PATCH /api/tasks/:id
  updateTask: asyncHandler(async (req, res) => {
    const updatedTask = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: updatedTask });
  }),

  // DELETE /api/tasks/:id
  deleteTask: asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  })
};