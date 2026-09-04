import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  boardId: z.string().min(1, "Board ID is required"),
  assignee: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const updateTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").optional(),
  boardId: z.string().optional(),
  assignee: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional()
});