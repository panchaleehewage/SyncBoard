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

// Fix 2f: Whitelist only the fields a client is allowed to update on a board
export const updateBoardSchema = z.object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    columns: z.array(columnSchema).optional(),
    tags: z.array(tagSchema).optional(),
});
