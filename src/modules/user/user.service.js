import User from "#modules/user/user.model.js";
import Profile from "#modules/profile/profile.model.js";
import Post from "#modules/social/post/post.model.js";
import Follow from "#modules/social/follow/follow.model.js";
import AppError from "#utils/AppError.js";
import { getPagination, getPaginationMeta } from "#utils/pagination.utils.js";
import { Op } from "sequelize";

export const getUserProfile = async (
    currentUserId,
    profileUserId
) => {

    const user = await User.findByPk(profileUserId, {
        attributes: ["id", "firstName", "lastName", "userName"],
        include: [
            {
                model: Profile,
                as: "profile",
                attributes: [
                    "bio",
                    "avatar",
                    "banner"
                ],
            }
        ]
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const [
        followersCount,
        followingCount,
        postsCount,
        followRecord
    ] = await Promise.all([
        Follow.count({
            where: {
                followingId: profileUserId
            }
        }),

        Follow.count({
            where: {
                followerId: profileUserId
            }
        }),

        Post.count({
            where: {
                userId: profileUserId
            }
        }),

        Follow.findOne({
            where: {
                followerId: currentUserId,
                followingId: profileUserId
            }
        })
    ]);

    return {
        ...user.toJSON(),

        followersCount,
        followingCount,
        postsCount,

        isFollowing: !!followRecord
    };
};

export const getSuggestions = async (userId, query) => {

    const { page, limit, offset } = getPagination(query);

    const following = await Follow.findAll({
        where: {
            followerId: userId
        },
        attributes: ["followingId"],
        raw: true
    });

    const followingIds = following.map(
        item => item.followingId
    );

    const excludedIds = [
        userId,
        ...followingIds
    ];

    const users = await User.findAndCountAll({
        where: {
            id: { [Op.notIn]: excludedIds }
        },
        attributes: ["id", "firstName", "lastName", "userName", "email"],
        limit,
        offset,
        order: [["createdAt", "DESC"]]
    });

    // console.log(users);

    return {
        meta: getPaginationMeta(
            users.count,
            page,
            limit
        ),
        data: users.rows
    };
};