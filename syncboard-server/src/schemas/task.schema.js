import { z } from 'zod';

export const createTaskSchema = z.object({
  // Fix 3b: Allow frontend to pass a client-generated id; repository will ignore it
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  boardId: z.number().int("Board ID must be an integer"),
  assignee: z.string().min(1, "Assignee is required"),
  // Fix 3a: status is a free string — custom column names are valid
  status: z.string().min(1, "Status is required"),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const updateTaskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long").optional(),
  boardId: z.number().int().optional(),
  assignee: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional()
});