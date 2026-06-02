import express from "express";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { getFollowers, getFollowing, toggleFollow } from "#modules/social/follow/follow.controller.js";
import { getFollowListSchema, toggleFollowSchema } from "#modules/social/follow/follow.schema.js";
import { getUserProfileSchema } from "./user.schema.js";
import { getUserProfile } from "./user.controller.js";

const userRoutes = express.Router();

// userRoutes.post("/", validate(createUserSchema), createUser);
userRoutes.get("/:id/profile", authenticate, validate(getUserProfileSchema), getUserProfile);

userRoutes.post("/:userId/follow", authenticate, validate(toggleFollowSchema), toggleFollow);
userRoutes.get("/:userId/followers", validate(getFollowListSchema), getFollowers);
userRoutes.get("/:userId/following", validate(getFollowListSchema), getFollowing);

export default userRoutes;
