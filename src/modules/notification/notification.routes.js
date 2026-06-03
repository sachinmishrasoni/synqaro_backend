import { Router } from "express";
import { deleteNotification, getNotifications, markAllAsRead, markAsRead } from "./notification.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.js";
import { getNotificationsSchema, notificationIdSchema } from "./notification.schema.js";

const notificationRoutes = Router();

notificationRoutes.get("/", authenticate, validate(getNotificationsSchema), getNotifications);
notificationRoutes.patch("/:notificationId/read", authenticate, validate(notificationIdSchema), markAsRead);
notificationRoutes.patch("/read-all", authenticate, markAllAsRead);
notificationRoutes.delete("/:notificationId", authenticate, validate(notificationIdSchema), deleteNotification);

export default notificationRoutes;
