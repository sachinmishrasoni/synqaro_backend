import { Router } from "express";
import { deleteAvatar, getMyProfile, updateProfile, uploadAvatar } from "./profile.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.js";
import { updateProfileSchema } from "./profile.schema.js";
import upload from "#middlewares/upload.middleware.js";

const profileRoutes = Router();

profileRoutes.get("/me", authenticate, getMyProfile);
profileRoutes.put("/me", authenticate, validate(updateProfileSchema), updateProfile);
profileRoutes.patch("/avatar", authenticate, upload.single("avatar"), uploadAvatar);
profileRoutes.delete("/avatar", authenticate, deleteAvatar);

export default profileRoutes;