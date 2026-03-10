import { Router } from "express";
import { login, refreshToken, register, resendOtp, verifyEmailOtp } from "./auth.controller.js";
import { validate } from "#middlewares/validate.js";
import { loginSchema, logoutSchema, refreshTokenSchema, registerUserSchema, resendOtpSchema, verifyEmailOtpSchema } from "./auth.schema.js";
import { logoutUser } from "./auth.service.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerUserSchema), register);
authRoutes.post("/verify-email-otp", validate(verifyEmailOtpSchema), verifyEmailOtp);
authRoutes.post("/resend-otp", validate(resendOtpSchema), resendOtp);
authRoutes.post("/login", validate(loginSchema), login);
authRoutes.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
authRoutes.post("/logout", validate(logoutSchema), logoutUser);
// authRoutes.post("/forgot-password", forgotPassword);
// authRoutes.post("/reset-password", resetPassword);
// authRoutes.post("/change-password", changePassword);

export default authRoutes;