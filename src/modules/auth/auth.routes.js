import { Router } from "express";
import { register } from "./auth.controller.js";

const authRoutes = Router();

authRoutes.post("/register", register);
// authRoutes.post("/login", asyncHandler(loginUser));
// authRoutes.post("/logout", asyncHandler(logoutUser));
// authRoutes.post("/refresh-token", asyncHandler(refreshToken));
// authRoutes.post("/forgot-password", asyncHandler(forgotPassword));
// authRoutes.post("/reset-password", asyncHandler(resetPassword));
// authRoutes.post("/change-password", asyncHandler(changePassword));

export default authRoutes;