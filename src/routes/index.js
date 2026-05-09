import { Router } from "express"
import authRoutes from "#modules/auth/auth.routes.js";
// import userRoutes from "#modules/user/user.routes";
import profileRoutes from "#modules/profile/profile.routes.js";
import postRoutes from "#modules/social/post/post.routes.js";


const router = Router();

router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/posts", postRoutes);

export default router;