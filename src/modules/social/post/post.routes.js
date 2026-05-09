import { Router } from "express";
import { createPost } from "./post.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import upload from "#middlewares/upload.middleware.js";

const postRoutes = Router();

postRoutes.post("/", authenticate, upload.single("image"), createPost);
// postRoutes.get("/", getAllPosts);
// postRoutes.get("/:id", getSinglePost);
// postRoutes.put("/:id", updatePost);
// postRoutes.delete("/:id", deletePost);

export default postRoutes;