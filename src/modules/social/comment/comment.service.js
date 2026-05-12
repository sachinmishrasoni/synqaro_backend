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

// export const getComments = async (postId) => {

//     const comments = await Comment.findAll({
//         where: {
//             postId,
//             parentId: null
//         },
//         attributes: {
//             exclude: ["userId", "deletedAt"]
//         },
//         include: [
//             {
//                 model: User,
//                 as: "user",
//                 attributes: ["id", "firstName", "lastName", "email", "userName"]
//             },
//             {
//                 model: Comment,
//                 as: "replies",
//                 attributes: {
//                     exclude: ["userId", "postId", "deletedAt"]
//                 },
//                 include: [
//                     {
//                         model: User,
//                         as: "user",
//                         attributes: ["id", "firstName", "lastName", "email", "userName"]
//                     }
//                 ]
//             }
//         ],
//         order: [["createdAt", "DESC"]]
//     })

//     return comments;
// };

const buildTree = (comments) => {
    const map = {};
    const tree = [];

    comments.forEach(comment => {
        map[comment.id] = {
            ...comment.toJSON(),
            replies: []
        };
    });

    comments.forEach(comment => {
        if (comment.parentId) {
            map[comment.parentId]?.replies.push(map[comment.id]);
        } else {
            tree.push(map[comment.id]);
        }
    });

    return tree;
};

export const getComments = async (postId) => {
    const comments = await Comment.findAll({
        where: {
            postId,
        },
        attributes: { exclude: ["userId", "deletedAt"] },
        include: {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "userName"]
        },
        order: [["createdAt", "DESC"]]
    });

    return buildTree(comments);
}

export const updateComment = async (userId, commentId, data) => {
    const { content } = data || {};

    if (!content) {
        throw new AppError("Content is required", 400);
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    if (comment.userId !== userId) {
        throw new AppError("You are not authorized to update this comment", 403);
    }

    await comment.update({ content });

    const updatedComment = await Comment.findByPk(commentId, {
        attributes: { exclude: ["userId", "deletedAt"] },
        include: {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "userName"]
        }
    });

    return updatedComment;
}

import sequelize from "#config/database.js";
import Comment from "./comment.model.js";
import AppError from "#utils/AppError.js";

const deleteRepliesRecursively = async (parentId, transaction) => {
    const replies = await Comment.findAll({
        where: { parentId },
        transaction
    });

    for (const reply of replies) {
        // delete nested replies first
        await deleteRepliesRecursively(reply.id, transaction);

        // delete current reply
        await reply.destroy({ transaction });
    }
};

export const deleteComment = async (userId, commentId) => {
    const transaction = await sequelize.transaction();

    try {
        const comment = await Comment.findByPk(commentId, {
            transaction
        });

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        // ownership check
        if (comment.userId !== userId) {
            throw new AppError("Not allowed to delete this comment", 403);
        }

        // delete nested replies recursively
        await deleteRepliesRecursively(comment.id, transaction);

        // delete parent comment
        await comment.destroy({ transaction });

        await transaction.commit();

        return {
            id: commentId
        };

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};
