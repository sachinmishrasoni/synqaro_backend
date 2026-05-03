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