import sequelize from "#config/database.js";
import { Comment, Post, Tag, User } from "#models/index.js";
import AppError from "#utils/AppError.js";
import { Op } from "sequelize";
import { getOrCreateTags } from "../tag/tag.service.js";
import { getReactionSummary } from "../reaction/reaction.service.js";


// Create Post
export const createPost = async (userId, data) => {
    const transaction = await sequelize.transaction();

    try {
        const { tags = [], ...postData } = data;

        // Step 1: Create post
        const post = await Post.create({
            userId,
            ...postData
        }, { transaction });

        // Step 2: Handle tags
        if (tags.length > 0) {
            const allTags = await getOrCreateTags(tags, transaction);
            await post.setTags(allTags, { transaction });
        }

        await transaction.commit();

        // Step 3: Fetch full data with relations
        const fullPost = await Post.findByPk(post.id, {
            attributes: { exclude: ["imagePublicId", "userId", "deletedAt"] },
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
            ]
        });

        return fullPost;

    } catch (error) {
        // await transaction.rollback();
        if (!transaction.finished) {
            await transaction.rollback();
        }
        throw error;
    }
};

// Get Posts
export const getPosts = async (query, currentUserId) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { userId, tag, search, status } = query;

    const where = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (search) where.title = {
        [Op.like]: `%${search}%`
    };

    const include = [
        {
            model: Tag,
            as: "tags",
            attributes: ["id", "name"],
            through: { attributes: [] }, // hide post_tags
            ...(tag && { where: { name: tag } })
        },
        {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "userName"]
        },
    ];

    const posts = await Post.findAndCountAll({
        where,
        include,
        distinct: true,
        limit,
        offset,
        attributes: {
            exclude: ["imagePublicId", "userId", "deletedAt"],
            include: [
                [
                    sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM reactions r
                    WHERE r.entity_type = 'post'
                    AND r.entity_id = Post.id
                        )`),
                    "reactionCount"
                ],
                [
                    sequelize.literal(`(
                SELECT COUNT(*)
                FROM comments c
                WHERE c.post_id = Post.id
                AND c.deleted_at IS NULL
                    )`),
                    "commentCount"
                ],
                [
                    sequelize.literal(`(
                SELECT type
                FROM reactions r
                WHERE r.entity_type = 'post'
                AND r.entity_id = Post.id
                AND r.user_id = ${currentUserId}
                LIMIT 1
            )`),
                    "myReaction"
                ]
            ]
        },
        order: [["createdAt", "DESC"]],
    });

    return {
        meta: {
            total: posts.count,
            page,
            limit,
            totalPages: Math.ceil(posts.count / limit)
        },
        data: posts.rows
    };
}

// Get Post by Id
export const getPostById = async (postId, userId) => {
    const post = await Post.findByPk(postId, {
        attributes: { exclude: ["imagePublicId", "userId", "deletedAt"] },
        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: { attributes: [] }
            },
            {
                model: User,
                as: "user",
                attributes: ["id", "firstName", "lastName", "email", "userName"]
            },
        ]
    });

    if (!post) {
        throw new AppError("Post not found", 404);
    }

    const commentCount = await Comment.count({
        where: {
            postId,
            deletedAt: null
        }
    });

    const reactionSummary = await getReactionSummary(
        "post",
        postId,
        userId
    );

    return {
        ...post.toJSON(),
        commentCount,
        reactionSummary,
    };
}

// Update Post
export const updatePost = async (userId, postId, data) => {
    const transaction = await sequelize.transaction();

    try {
        const { tags = [], ...postData } = data;

        const post = await Post.findByPk(postId, { transaction });

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        if (post.userId !== userId) {
            throw new AppError("You are not authorized to update this post", 403);
        }

        await post.update(postData, { transaction });

        if (tags) {
            const allTags = await getOrCreateTags(tags, transaction);
            await post.setTags(allTags, { transaction });
        }

        await transaction.commit();

        const fullPost = await Post.findByPk(post.id, {
            attributes: { exclude: ["imagePublicId", "userId", "deletedAt"] },
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
            ]
        });

        return fullPost;

    } catch (err) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        throw err;
    }
}

// Delete Post
export const deletePost = async (userId, postId) => {
    const post = await Post.findByPk(postId);

    if (!post) {
        throw new AppError("Post not found", 404);
    }

    if (post.userId !== userId) {
        throw new AppError("You are not authorized to delete this post", 403);
    }

    await post.destroy();

    return true;
}
