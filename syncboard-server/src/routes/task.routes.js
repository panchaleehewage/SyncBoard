import express from 'express';
import { taskController } from '../controllers/task.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';

const router = express.Router();

router.route('/')
  .get(taskController.getAllTasks)
  .post(validate(createTaskSchema), taskController.createTask);

router.route('/:id')
  .get(taskController.getTaskById)
  .patch(validate(updateTaskSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;