import sequelize from "#config/database.js";
import User from "#modules/user/user.model.js";
import Follow from "./follow.model.js";
import AppError from "#utils/AppError.js";
import { NOTIFICATION_TYPES } from "#constants/notification.constants.js";
import { createNotification } from "#modules/notification/notification.service.js";
import { isBlocked } from "#modules/block/block.utils.js";

export const toggleFollow = async (followerId, followingId) => {
    const transaction = await sequelize.transaction();

    try {

        // Cannot follow yourself
        if (followerId === Number(followingId)) {
            throw new AppError("You cannot follow yourself", 400);
        }

        // Check target user exists
        const user = await User.findByPk(
            followingId,
            { transaction }
        );

        if (!user) {
            throw new AppError("User not found", 404);
        }

        // Block check
        const blocked = await isBlocked(followerId, followingId);
        if (blocked) {
            throw new AppError("You cannot follow this user", 403);
        }

        // Check existing follow
        const existingFollow = await Follow.findOne({
            where: {
                followerId,
                followingId
            },
            transaction
        });

        // Unfollow
        if (existingFollow) {

            await existingFollow.destroy({
                transaction
            });

            await transaction.commit();

            return {
                action: "unfollowed"
            };
        }

        // Follow
        await Follow.create({ followerId, followingId }, {
            transaction
        });

        const follower = await User.findByPk(followerId, {
            attributes: ["id", "firstName", "lastName", "userName"],
        });

        await createNotification({
            senderId: followerId,
            receiverId: followingId,
            type: NOTIFICATION_TYPES.FOLLOW,
            title: "New Follower",
            message: `${follower.userName} started following you`
        });

        await transaction.commit();

        return {
            action: "followed"
        };

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};

export const getFollowers = async (userId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const followers = await Follow.findAndCountAll({
        where: {
            followingId: userId
        },
        limit,
        offset,
        include: [
            {
                model: User,
                as: "follower",
                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "userName"
                ]
            }
        ],
        order: [["createdAt", "DESC"]]
    });

    return {
        meta: {
            total: followers.count,
            page,
            limit,
            totalPages: Math.ceil(
                followers.count / limit
            )
        },
        data: followers.rows
    };
};

export const getFollowing = async (userId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const following = await Follow.findAndCountAll({
        where: {
            followerId: userId
        },
        limit,
        offset,
        include: [
            {
                model: User,
                as: "following",
                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "userName"
                ]
            }
        ],
        order: [["createdAt", "DESC"]]
    });

    return {
        meta: {
            total: following.count,
            page,
            limit,
            totalPages: Math.ceil(
                following.count / limit
            )
        },
        data: following.rows
    };
};