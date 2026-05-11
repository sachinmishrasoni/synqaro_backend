import { Router } from "express";
import { createComment } from "./comment.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.post("/", authenticate, createComment);

export default commentRoutes;
