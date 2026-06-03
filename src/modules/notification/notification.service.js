import { User } from "#models/index.js";
import AppError from "#utils/AppError.js";
import { getPagination, getPaginationMeta } from "#utils/pagination.utils.js";
import Notification from "./notification.model.js";


export const createNotification = async ({
    senderId = null,
    receiverId,
    type,
    title,
    message,
    entityType = null,
    entityId = null,
    data = null
}) => {

    return Notification.create({
        senderId,
        receiverId,
        type,
        title,
        message,
        entityType,
        entityId,
        data
    });
};


export const getNotifications = async (userId, query) => {

    const { page, limit, offset } = getPagination(query);

    const notifications = await Notification.findAndCountAll({
        where: {
            receiverId: userId
        },

        include: [
            {
                model: User,
                as: "sender",
                attributes: ["id", "firstName", "lastName", "userName"]
            }
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset
    });

    return {
        meta: getPaginationMeta(
            notifications.count,
            page,
            limit
        ),

        data: notifications.rows
    };
};

export const markAsRead = async (userId, notificationId) => {

    const notification = await Notification.findOne({
        where: {
            id: notificationId,
            receiverId: userId
        }
    });

    if (!notification) {
        throw new AppError("Notification not found", 404);
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();

    return notification;
};

export const markAllAsRead = async (userId) => {

    await Notification.update(
        {
            isRead: true,
            readAt: new Date()
        },
        {
            where: {
                receiverId: userId,
                isRead: false
            }
        }
    );

    return null;
};

export const deleteNotification = async (userId, notificationId) => {

    const notification = await Notification.findOne({
        where: {
            id: notificationId,
            receiverId: userId
        }
    });

    if (!notification) {
        throw new AppError("Notification not found", 404);
    }

    await notification.destroy();

    return notification;
};

