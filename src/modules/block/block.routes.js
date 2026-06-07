import { Router } from "express";
import { blockUser, getBlockedUsers, unblockUser } from "./block.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { blockUserSchema, getBlockedUsersSchema, unblockUserSchema } from "./block.schema.js";
import { validate } from "#middlewares/validate.js";


const blockRoutes = Router();

blockRoutes.post("/:userId/block", authenticate, validate(blockUserSchema), blockUser);
blockRoutes.delete("/:userId/block", authenticate, validate(unblockUserSchema), unblockUser);
blockRoutes.get("/blocked", authenticate, validate(getBlockedUsersSchema), getBlockedUsers);

export default blockRoutes;