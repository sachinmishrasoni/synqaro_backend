import sequelize from "#config/database.js";
import { Comment, Post, Reaction, User } from "#models/index.js";
import AppError from "#utils/AppError.js";

export const reactToEntity = async (userId, data) => {
    const transaction = await sequelize.transaction();

    try {
        const { entityType, entityId, type: reactionType } = data;

        // Validate entity
        if (entityType === "post") {
            const post = await Post.findByPk(entityId, { transaction });

            if (!post) {
                throw new AppError("Post not found", 404);
            }
        }

        if (entityType === "comment") {
            const comment = await Comment.findByPk(entityId, { transaction });

            if (!comment) {
                throw new AppError("Comment not found", 404);
            }
        }

        // Check existing reaction
        const existingReaction = await Reaction.findOne({
            where: {
                userId,
                entityType,
                entityId,
            },
            transaction
        });

        // Remove reaction
        if (existingReaction && existingReaction.type === reactionType) {
            await existingReaction.destroy({ transaction });

            await transaction.commit();

            return {
                action: "removed",
                entityType,
                entityId
            };
        }

        // Update reaction
        if (existingReaction) {
            await existingReaction.update({ type: reactionType }, { transaction });

            await transaction.commit();

            return {
                action: "updated",
                reaction: existingReaction
            };
        }

        // Create reaction
        const reaction = await Reaction.create({
            userId,
            entityType,
            entityId,
            type: reactionType
        }, { transaction });

        await transaction.commit();

        return {
            action: "created",
            reaction
        };

    } catch (err) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw err;
    }
};

export const getReactionSummary = async (
    entityType,
    entityId,
    userId
) => {
    const reactions = await Reaction.findAll({
        where: {
            entityType,
            entityId
        },
        attributes: [
            "type",
            [sequelize.fn("COUNT", sequelize.col("id")), "count"]
        ],
        group: ["type"],
        raw: true
    });

    const counts = {
        like: 0,
        love: 0,
        wow: 0,
        sad: 0,
        dislike: 0
    };

    reactions.forEach(reaction => {
        counts[reaction.type] = Number(reaction.count);
    });

    const myReaction = userId
        ? await Reaction.findOne({
            where: {
                userId,
                entityType,
                entityId
            },
            attributes: ["type"]
        })
        : null;

    return {
        counts,
        total: Object.values(counts)
            .reduce((sum, count) => sum + count, 0),
        myReaction: myReaction?.type || null
    };
};

export const getReactions = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { entityType, entityId, type } = query;

    const where = {
        entityType,
        entityId
    };

    if (type) {
        where.type = type;
    }

    const reactions = await Reaction.findAndCountAll({
        where,
        limit,
        offset,
        include: [
            {
                model: User,
                as: "user",
                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "userName"
                ]
            }
        ],
        attributes: { exclude: ["userId", "deletedAt"] },
        order: [["createdAt", "DESC"]]
    });

    return {
        meta: {
            total: reactions.count,
            page,
            limit,
            totalPages: Math.ceil(
                reactions.count / limit
            )
        },
        data: reactions.rows
    };
};
