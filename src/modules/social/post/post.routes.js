import { Router } from "express";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "./post.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import upload from "#middlewares/upload.middleware.js";

const postRoutes = Router();

postRoutes.post("/", authenticate, upload.single("image"), createPost);
postRoutes.get("/", authenticate, getPosts);
postRoutes.get("/:id", authenticate, getPostById);
postRoutes.put("/:id", authenticate, upload.single("image"), updatePost);
postRoutes.delete("/:id", authenticate, deletePost);

export default postRoutes;