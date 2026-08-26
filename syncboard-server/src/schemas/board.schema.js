import { z } from 'zod';

// Shared sub-schemas
const columnSchema = z.object({
    label: z.string().min(1, "Column label is required"),
    color: z.string().min(1, "Column color is required"),
});

const tagSchema = z.object({
    label: z.string().min(1, "Tag label is required"),
    color: z.string().min(1, "Tag color is required"),
});

// Schema for creating a new board
export const createBoardSchema = z.object({
    title: z.string().min(1, "Title is required"),
    columns: z.array(columnSchema).min(1, "At least one column is required"),
    tags: z.array(tagSchema).optional().default([]),
    members: z.array(z.string()).optional().default([]),
});

// Fix 2f: Whitelist only the fields a client is allowed to update on a board
export const updateBoardSchema = z.object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    columns: z.array(columnSchema).optional(),
    tags: z.array(tagSchema).optional(),
    members: z.array(z.string()).min(1, "Board must have at least one member").optional(),
});
