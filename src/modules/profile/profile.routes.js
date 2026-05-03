import { Router } from "express";
import { getMyProfile } from "./profile.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";

const profileRoutes = Router();

profileRoutes.get("/", authenticate, getMyProfile);

export default profileRoutes;