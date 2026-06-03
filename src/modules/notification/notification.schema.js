import { z } from "zod";

export const notificationIdSchema = {
    params: z.object({
        notificationId: z.coerce
            .number()
            .int()
            .positive()
    })
};

export const getNotificationsSchema = {
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
