import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z
        .string()
        .min(3, "First name must be at least 3 characters")
        .max(100),

    lastName: z
        .string()
        .min(3, "Last name must be at least 3 characters")
        .max(100)
        .optional(),

    userName: z
        .string()
        .min(3, "User name must be at least 3 characters")
        .max(100),

    email: z
        .string()
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
