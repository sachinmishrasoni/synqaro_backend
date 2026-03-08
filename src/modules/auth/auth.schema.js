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

export const verifyEmailOtpSchema = z.object({
    userId: z
        .number({
            required_error: "User id is required",
            invalid_type_error: "User id must be a number"
        })
        .int()
        .positive("Invalid user id"),

    // userId: z.coerce.number().int().positive("Invalid user id"),

    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers")
});
