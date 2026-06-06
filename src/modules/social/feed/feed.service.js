import { Follow, Post, Tag, User } from "#models/index.js";
import { Op } from "sequelize";
import { getPostMetaAttributes, normalizePost } from "../post/post.utils.js";
import { getPagination, getPaginationMeta } from "#utils/pagination.utils.js";

export const getFeed = async (userId, query) => {
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

    const feedUserIds = [
        userId,
        ...followingIds
    ];

    const posts = await Post.findAndCountAll({
        where: {
            userId: {
                [Op.in]: feedUserIds
            }
        },
        limit,
        offset,
        distinct: true,

        attributes: {
            exclude: ["imagePublicId", "userId", "deletedAt"],
            include: getPostMetaAttributes(userId)
        },

        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: { attributes: [] } // hide post_tags
            },
            {
                model: User,
                as: "user",
                attributes: ["id", "firstName", "lastName", "email", "userName"]
            },
        ],
        order: [["createdAt", "DESC"]]
    });

    return {
        meta: getPaginationMeta(posts.count, page, limit),
        data:  posts.rows.map(normalizePost)
    };
};
