import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as followService from "./follow.service.js";

export const toggleFollow = asyncHandler(async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    const result = await followService.toggleFollow(
        followerId,
        followingId
    );

    sendResponse(res, {
        statusCode: 200,
        message: `User ${result.action} successfully`,
        data: result
    });
});


export const getFollowers = asyncHandler(async (req, res) => {
    const result = await followService.getFollowers(
        req.params.userId,
        req.query
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Followers fetched successfully",
        data: result.data,
        meta: result.meta
    });
});

export const getFollowing = asyncHandler(async (req, res) => {
    const result = await followService.getFollowing(
        req.params.userId,
        req.query
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Following fetched successfully",
        data: result.data,
        meta: result.meta
    });
});