import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z
        .string()
        .min(3, "First name must be at least 3 characters")
        .max(25),

    lastName: z
        .string()
        .min(3, "Last name must be at least 3 characters")
        .max(25)
        .optional(),

    userName: z
        .string()
        .min(6, "User name must be at least 6 characters")
        .max(15, "User name must be at most 15 characters"),

    email: z
        .email("Invalid email format"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    role: z
        .enum(["user", "admin"])
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});

export const getUserProfileSchema = {
    params: z.object({
        id: z.coerce
            .number()
            .int()
            .positive()
    })
};

export const getSuggestionsSchema = {
    query: z.object({
        page: z.coerce.number().optional(),
        limit: z.coerce.number().optional()
    })
};