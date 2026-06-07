import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as blockService from "./block.service.js";

export const blockUser = asyncHandler(async (req, res) => {

    const block = await blockService.blockUser(
        req.user.id,
        req.validated.params.userId
    );

    sendResponse(res, {
        statusCode: 201,
        message: "User blocked successfully",
        data: block
    });
});

export const unblockUser = asyncHandler(async (req, res) => {

    await blockService.unblockUser(
        req.user.id,
        req.validated.params.userId
    );

    sendResponse(res, {
        statusCode: 200,
        message: "User unblocked successfully"
    });
});

export const getBlockedUsers = asyncHandler(async (req, res) => {

    const users = await blockService.getBlockedUsers(
        req.user.id,
        req.validated.query
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Blocked users fetched successfully",
        data: users.data,
        meta: users.meta
    });
});