import { Comment, Post, User } from "#models/index.js";
import AppError from "#utils/AppError.js";

export const createComment = async (userId, data) => {
    const { postId, content, parentId } = data || {};

    const post = await Post.findByPk(postId);
    if (!post) {
        throw new AppError("Post not found", 404);
    }

    if (parentId) {
        const parentComment = await Comment.findByPk(parentId);
        if (!parentComment) {
            throw new AppError("Parent comment not found", 404);
        }

        if (parentComment.postId !== post.id) {
            throw new AppError("Invalid parent comment for this post", 400);
        }
    }

    const comment = await Comment.create({
        userId,
        postId,
        content,
        parentId: parentId || null
    });

    const fullComment = await Comment.findByPk(comment.id, {
        attributes: { exclude: ["userId", "postId", "deletedAt"] },
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "firstName", "lastName", "email", "userName"]
            }
        ]
    });

    return fullComment;
};

export const getComments = async (postId) => {

    const comments = await Comment.findAll({
        where: {
            postId,
            parentId: null
        },
        attributes: {
            exclude: ["userId", "deletedAt"]
        },
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "firstName", "lastName", "email", "userName"]
            },
            {
                model: Comment,
                as: "replies",
                attributes: {
                    exclude: ["userId", "postId", "deletedAt"]
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "firstName", "lastName", "email", "userName"]
                    }
                ]
            }
        ],
        order: [["createdAt", "DESC"]]
    })

    return comments;
};
