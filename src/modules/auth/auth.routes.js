import { Router } from "express";
import { login, register, resendOtp, verifyEmailOtp } from "./auth.controller.js";
import { validate } from "#middlewares/validate.js";
import { loginSchema, registerUserSchema, resendOtpSchema, verifyEmailOtpSchema } from "./auth.schema.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerUserSchema), register);
authRoutes.post("/verify-email-otp", validate(verifyEmailOtpSchema), verifyEmailOtp);
authRoutes.post("/resend-otp", validate(resendOtpSchema), resendOtp);
authRoutes.post("/login", validate(loginSchema), login);
// authRoutes.post("/logout", asyncHandler(logoutUser));
// authRoutes.post("/refresh-token", asyncHandler(refreshToken));
// authRoutes.post("/forgot-password", asyncHandler(forgotPassword));
// authRoutes.post("/reset-password", asyncHandler(resetPassword));
// authRoutes.post("/change-password", asyncHandler(changePassword));

export default authRoutes;