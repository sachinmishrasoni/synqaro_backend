import { Router } from "express"
import authRoutes from "#modules/auth/auth.routes.js";
// import userRoutes from "#modules/user/user.routes";
import profileRoutes from "#modules/profile/profile.routes.js";


const router = Router();

router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
router.use("/profile", profileRoutes);

export default router;