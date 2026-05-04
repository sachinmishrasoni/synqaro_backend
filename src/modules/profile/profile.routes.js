import { Router } from "express";
import { updateMedia, deleteAvatar, deleteBanner, getMyProfile, updateProfile, uploadAvatar, uploadBanner } from "./profile.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.js";
import { updateProfileSchema } from "./profile.schema.js";
import upload from "#middlewares/upload.middleware.js";

const profileRoutes = Router();

profileRoutes.get("/me", authenticate, getMyProfile);
profileRoutes.put("/me", authenticate, validate(updateProfileSchema), updateProfile);

profileRoutes.patch("/media", authenticate, upload.fields([{ name: "avatar", maxCount: 1 }, { name: "banner", maxCount: 1 }]), updateMedia);

profileRoutes.patch("/banner", authenticate, upload.single("banner"), uploadBanner);
profileRoutes.delete("/banner", authenticate, deleteBanner);

profileRoutes.patch("/avatar", authenticate, upload.single("avatar"), uploadAvatar);
profileRoutes.delete("/avatar", authenticate, deleteAvatar);

export default profileRoutes;