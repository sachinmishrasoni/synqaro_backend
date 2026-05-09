import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(1, "Content is required"),
    status: z.enum(["draft", "published"]).optional()
});

export const updatePostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(1, "Content is required"),
    status: z.enum(["draft", "published"]).optional()
});
