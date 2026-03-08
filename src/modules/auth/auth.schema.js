import { z } from "zod";

export const registerUserSchema = z.object({
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
});
