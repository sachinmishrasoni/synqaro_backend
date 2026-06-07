import express from "express";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { getSuggestionsSchema, getUserProfileSchema } from "./user.schema.js";
import { getSuggestions, getUserProfile } from "./user.controller.js";
import blockRoutes from "#modules/block/block.routes.js";
import followRoutes from "#modules/social/follow/follow.routes.js";

const userRoutes = express.Router();

// block routes mount
// userRoutes.use("/", blockRoutes);
userRoutes.use(blockRoutes);

// follow routes mount
userRoutes.use(followRoutes);

userRoutes.get("/suggestions", authenticate, validate(getSuggestionsSchema), getSuggestions);

// userRoutes.post("/", validate(createUserSchema), createUser);
userRoutes.get("/:id/profile", authenticate, validate(getUserProfileSchema), getUserProfile);

export default userRoutes;
