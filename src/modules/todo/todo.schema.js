import { z } from "zod";
import { TODO_PRIORITY, TODO_STATUS } from "#constants/todo.constants.js";

export const createTodoSchema = {
    body: z.object({
        parentId: z.coerce
            .number()
            .int()
            .positive()
            .optional()
            .nullable(),

        title: z
            .string()
            .trim()
            .min(3, "Title must be at least 3 characters")
            .max(255, "Title must not exceed 255 characters"),

        description: z
            .string()
            .trim()
            .max(5000, "Description must not exceed 5000 characters")
            .optional()
            .nullable(),

        priority: z
            .enum(Object.values(TODO_PRIORITY))
            .optional(),

        status: z
            .enum(Object.values(TODO_STATUS))
            .optional(),

        dueDate: z.coerce
            .date()
            .optional()
    })
};



export const bulkDeleteTodoSchema = z.object({
    body: z.object({
        ids: z
            .array(z.number().int().positive())
            .min(1, "At least one todo id is required."),
    }),
});
