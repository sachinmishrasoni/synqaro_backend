import { Op } from "sequelize";
import Block from "./block.model";

export const isBlocked = async (userId, targetUserId) => {

    const block = await Block.findOne({
        where: {
            [Op.or]: [
                {
                    blockerId: userId,
                    blockedId: targetUserId
                },
                {
                    blockerId: targetUserId,
                    blockedId: userId
                }
            ]
        }
    });

    return Boolean(block);
};
