import { Router } from "express";
import { authenticate } from "#middlewares/auth.middleware.js";
import { toggleFollow } from "./follow.controller.js";
import { toggleFollowSchema } from "./follow.schema.js";
import { validate } from "#middlewares/validate.js";

const followRoutes = Router();

followRoutes.post("/:userId", authenticate, validate(toggleFollowSchema), toggleFollow);

export default followRoutes;