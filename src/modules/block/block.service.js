import { Block, User } from "#models/index.js";
import AppError from "#utils/AppError.js";
import { getPagination, getPaginationMeta } from "#utils/pagination.utils.js";

export const blockUser = async (blockerId, blockedId) => {

    if (blockerId === blockedId) {
        throw new AppError("You cannot block yourself", 400);
    }

    const user = await User.findByPk(blockedId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const existingBlock = await Block.findOne({
        where: {
            blockerId,
            blockedId
        }
    });

    if (existingBlock) {
        throw new AppError("User is already blocked", 400);
    }

    return Block.create({
        blockerId,
        blockedId
    });
};

export const unblockUser = async (blockerId, blockedId) => {

    const block = await Block.findOne({
        where: {
            blockerId,
            blockedId
        }
    });

    if (!block) {
        throw new AppError("Block record not found", 404);
    }

    await block.destroy();

    return null;
};

export const getBlockedUsers = async (blockerId, query) => {

    const { page, limit, offset } = getPagination(query);

    const blockedUsers = await Block.findAndCountAll({
        where: {
            blockerId
        },
        include: [
            {
                model: User,
                as: "blocked",
                attributes: ["id", "firstName", "lastName", "userName", "email"],
            }
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]]
    });

    return {
        meta: getPaginationMeta(
            blockedUsers.count,
            page,
            limit
        ),
        data: blockedUsers.rows
    };
};
