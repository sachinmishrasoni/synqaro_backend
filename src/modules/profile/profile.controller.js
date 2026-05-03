import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as profileService from "./profile.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await profileService.getMyProfile(userId);


    sendResponse(res, {
        statusCode: 200,
        message: "Profile fetched successfully",
        data: profile
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await profileService.updateProfile(userId, req.body);

    sendResponse(res, {
        statusCode: 200,
        message: "Profile updated successfully",
        data: profile
    });
});