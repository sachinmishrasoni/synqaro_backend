import { z } from "zod";

export const toggleBookmarkSchema = {
    body: z.object({
        entityType: z.string({
            required_error: "Entity type is required"
        }),

        entityId: z.coerce
            .number()
            .int()
            .positive("Entity id must be a positive number")
    })
};

export const getBookmarksSchema = {
    query: z.object({
        page: z.coerce
            .number()
            .int()
            .positive()
            .optional(),

        limit: z.coerce
            .number()
            .int()
            .positive()
            .optional()
    })
};

export const removeBookmarkSchema = {
    params: z.object({
        bookmarkId: z.coerce
            .number()
            .int()
            .positive()
    })
};
