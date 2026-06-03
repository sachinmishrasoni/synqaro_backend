import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as notificationService from "./notification.service.js";

export const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await notificationService.getNotifications(
        req.user.id,
        req.validated.query
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Notifications fetched successfully",
        data: notifications.data,
        meta: notifications.meta
    });
});

export const markAsRead = asyncHandler(async (req, res) => {

    const notification = await notificationService.markAsRead(
            req.user.id,
            req.params.notificationId
        );

    sendResponse(res, {
        statusCode: 200,
        message: "Notification marked as read",
        data: notification
    });
});

export const markAllAsRead = asyncHandler(async (req, res) => {

    await notificationService.markAllAsRead(
        req.user.id
    );

    sendResponse(res, {
        statusCode: 200,
        message: "All notifications marked as read"
    });
});

export const deleteNotification = asyncHandler(async (req, res) => {

    const notification = await notificationService.deleteNotification(
            req.user.id,
            req.params.notificationId
        );

    sendResponse(res, {
        statusCode: 200,
        message: "Notification deleted successfully",
        data: {
            id: notification.id
        }
    });
});