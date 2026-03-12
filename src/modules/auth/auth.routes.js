import { Router } from "express";
import { changePassword, forgotPassword, login, refreshToken, register, resendOtp, resetPassword, verifyEmailOtp, verifyResetOtp } from "./auth.controller.js";
import { validate } from "#middlewares/validate.js";
import { changePasswordSchema, forgotPasswordSchema, loginSchema, logoutSchema, refreshTokenSchema, registerUserSchema, resendOtpSchema, resetPasswordSchema, verifyEmailOtpSchema, verifyResetOtpSchema } from "./auth.schema.js";
import { logoutUser } from "./auth.service.js";
import { authenticate } from "#middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerUserSchema), register);
authRoutes.post("/verify-email-otp", validate(verifyEmailOtpSchema), verifyEmailOtp);
authRoutes.post("/resend-otp", validate(resendOtpSchema), resendOtp);
authRoutes.post("/login", validate(loginSchema), login);
authRoutes.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
authRoutes.post("/logout", validate(logoutSchema), logoutUser);

authRoutes.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
authRoutes.post("/verify-reset-otp", validate(verifyResetOtpSchema), verifyResetOtp);
authRoutes.post("/reset-password", validate(resetPasswordSchema), resetPassword);

authRoutes.post("/change-password", authenticate, validate(changePasswordSchema), changePassword);

export default authRoutes;