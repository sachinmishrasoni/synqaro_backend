import { Router } from "express";
import { getMyProfile, updateProfile } from "./profile.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.js";
import { updateProfileSchema } from "./profile.schema.js";

const profileRoutes = Router();

profileRoutes.get("/me", authenticate, getMyProfile);
profileRoutes.put("/me", authenticate, validate(updateProfileSchema), updateProfile);

export default profileRoutes;