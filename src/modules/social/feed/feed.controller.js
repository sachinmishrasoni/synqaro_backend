import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as feedService from "./feed.service.js";

export const getFeed = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const feed = await feedService.getFeed(userId, req.query);

    sendResponse(res, {
        statusCode: 200,
        message: "Feed fetched successfully",
        data: feed.data,
        meta: feed.meta
    });
});