import { z } from "zod";

export const updateProfileSchema = z.object({
    banner: z.string().url().optional(),

    avatar: z.string().url().optional(),

    bio: z.string().max(500).optional(),

    location: z.string().max(100).optional(),

    dob: z.coerce.date().optional(),

    phone: z
        .string()
        .min(10)
        .max(15)
        .regex(/^[0-9]+$/, "Phone must be numeric")
        .optional(),

    passion: z.string().max(100).optional()
});