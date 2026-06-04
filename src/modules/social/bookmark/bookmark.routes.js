import { Router } from "express";
import { getBookmarks, removeBookmark, toggleBookmark } from "./bookmark.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.js";
import { getBookmarksSchema, removeBookmarkSchema, toggleBookmarkSchema } from "./bookmark.schema.js";

const bookmarkRoutes = Router();

bookmarkRoutes.post("/", authenticate, validate(toggleBookmarkSchema), toggleBookmark);
bookmarkRoutes.get("/", authenticate, validate(getBookmarksSchema), getBookmarks);
bookmarkRoutes.delete("/:bookmarkId", authenticate, validate(removeBookmarkSchema), removeBookmark);

export default bookmarkRoutes;