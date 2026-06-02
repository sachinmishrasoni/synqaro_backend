import { Router } from "express";
import { getFeed } from "./feed.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";

const feedRoutes = Router();

feedRoutes.get("/", authenticate, getFeed);

export default feedRoutes;
