import { Router } from "express";
import { getReactions, reactToEntity } from "./reaction.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.js";
import { reactToEntitySchema } from "./reaction.schema.js";

const reactionRoutes = Router();

reactionRoutes.post("/", authenticate, validate(reactToEntitySchema), reactToEntity);
reactionRoutes.get("/", authenticate, getReactions);

export default reactionRoutes;
