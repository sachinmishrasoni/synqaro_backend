import { z } from "zod";

export const reactToEntitySchema = z.object({
    entityType: z.enum(["post", "comment"]),

    entityId: z.coerce
        .number()
        .int()
        .positive(),

    type: z.enum([
        "like",
        "love",
        "wow",
        "sad",
        "dislike"
    ])
});

export const getReactionsSchema = {
    query: z.object({
        entityType: z.enum([
            "post",
            "comment"
        ]),

        entityId: z.coerce.number()
            .int()
            .positive(),

        type: z.enum([
            "like",
            "love",
            "wow",
            "sad",
            "dislike"
        ]).optional(),

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