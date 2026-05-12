import { Router } from "express";
import { createComment, getComments } from "./comment.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.post("/", authenticate, createComment);
commentRoutes.get("/", authenticate, getComments);

export default commentRoutes;
