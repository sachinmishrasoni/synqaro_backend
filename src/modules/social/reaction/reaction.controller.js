import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as reactionService from "./reaction.service.js";

export const reactToEntity = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const { entityType, entityId, type } = req.body || {};

    const result = await reactionService.reactToEntity(userId, {
        entityType,
        entityId,
        type
    });

    sendResponse(res, {
        statusCode: 200,
        message: `Reaction ${result.action} successfully`,
        data: result
    });
});

export const getReactions = asyncHandler(
    async (req, res) => {
        const reactions =
            await reactionService.getReactions(
                req.query
            );

        sendResponse(res, {
            statusCode: 200,
            message: "Reactions fetched successfully",
            data: reactions.data,
            meta: reactions.meta
        });
    }
);
