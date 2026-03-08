import { Router } from "express";
import { register, verifyEmailOtp } from "./auth.controller.js";
import { validate } from "#middlewares/validate.js";
import { registerUserSchema, verifyEmailOtpSchema } from "./auth.schema.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerUserSchema), register);
authRoutes.post("/verify-email-otp", validate(verifyEmailOtpSchema), verifyEmailOtp);
// authRoutes.post("/login", asyncHandler(loginUser));
// authRoutes.post("/logout", asyncHandler(logoutUser));
// authRoutes.post("/refresh-token", asyncHandler(refreshToken));
// authRoutes.post("/forgot-password", asyncHandler(forgotPassword));
// authRoutes.post("/reset-password", asyncHandler(resetPassword));
// authRoutes.post("/change-password", asyncHandler(changePassword));

export default authRoutes;