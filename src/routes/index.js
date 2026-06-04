import { Router } from "express"
import authRoutes from "#modules/auth/auth.routes.js";
import userRoutes from "#modules/user/user.routes.js";
import profileRoutes from "#modules/profile/profile.routes.js";
import feedRoutes from "#modules/social/feed/feed.routes.js";
import postRoutes from "#modules/social/post/post.routes.js";
import commentRoutes from "#modules/social/comment/comment.routes.js";
import reactionRoutes from "#modules/social/reaction/reaction.routes.js";
import notificationRoutes from "#modules/notification/notification.routes.js";
import bookmarkRoutes from "#modules/social/bookmark/bookmark.routes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/feed", feedRoutes);
router.use("/posts", postRoutes);
router.use("/posts/:id/comments", commentRoutes);
router.use("/reactions", reactionRoutes);
router.use("/notifications", notificationRoutes);
router.use("/bookmarks", bookmarkRoutes);

export default router;