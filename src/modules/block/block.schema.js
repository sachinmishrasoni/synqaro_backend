import { z } from "zod";

export const blockUserSchema = {
    params: z.object({
        userId: z.coerce
            .number()
            .int()
            .positive()
    })
};

export const unblockUserSchema = {
    params: z.object({
        userId: z.coerce
            .number()
            .int()
            .positive()
    })
};

export const getBlockedUsersSchema = {
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
