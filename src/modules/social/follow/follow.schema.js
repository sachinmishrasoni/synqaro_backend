import { z } from "zod";

export const toggleFollowSchema = {
    params: z.object({
        userId: z.coerce
            .number()
            .int()
            .positive()
    })
};

export const getFollowListSchema = {
    params: z.object({
        userId: z.coerce.number()
            .int()
            .positive()
    }),

    query: z.object({
        page: z.coerce.number()
            .int()
            .positive()
            .optional(),

        limit: z.coerce.number()
            .int()
            .positive()
            .optional()
    })
};