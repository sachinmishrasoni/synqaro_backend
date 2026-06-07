import { Router } from "express";
import { authenticate } from "#middlewares/auth.middleware.js";
import { getFollowers, getFollowing, toggleFollow } from "./follow.controller.js";
import { getFollowListSchema, toggleFollowSchema } from "./follow.schema.js";
import { validate } from "#middlewares/validate.js";

const followRoutes = Router();

followRoutes.post("/:userId/follow", authenticate, validate(toggleFollowSchema), toggleFollow);
followRoutes.get("/:userId/followers", validate(getFollowListSchema), getFollowers);
followRoutes.get("/:userId/following", validate(getFollowListSchema), getFollowing);

export default followRoutes;