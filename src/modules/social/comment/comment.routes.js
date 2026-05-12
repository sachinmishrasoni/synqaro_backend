import { Router } from "express";
import { createComment, deleteComment, getComments, updateComment } from "./comment.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.post("/", authenticate, createComment);
commentRoutes.get("/", authenticate, getComments);
commentRoutes.patch("/:commentId", authenticate, updateComment);
commentRoutes.delete("/:commentId", authenticate, deleteComment);

export default commentRoutes;
