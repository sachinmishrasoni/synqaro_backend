import express from "express";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { getFollowers, getFollowing, toggleFollow } from "#modules/social/follow/follow.controller.js";
import { getFollowListSchema, toggleFollowSchema } from "#modules/social/follow/follow.schema.js";

const userRoutes = express.Router();

// userRoutes.post("/", validate(createUserSchema), createUser);

userRoutes.post("/:userId/follow", authenticate, validate(toggleFollowSchema), toggleFollow);
userRoutes.get("/:userId/followers", validate(getFollowListSchema), getFollowers);
userRoutes.get( "/:userId/following",  validate(getFollowListSchema), getFollowing);

export default userRoutes;
