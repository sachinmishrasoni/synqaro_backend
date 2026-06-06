import asyncHandler from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/sendResponse.js";
import * as userService from "./user.service.js";

export const getUserProfile = asyncHandler(async (req, res) => {

    const currentUserId = req.user?.id;
    const profileUserId = req.params.id;

    const profile =
        await userService.getUserProfile(
            currentUserId,
            profileUserId
        );

    sendResponse(res, {
        statusCode: 200,
        message: "Profile fetched successfully",
        data: profile
    });
});

export const getSuggestions = asyncHandler(async (req, res) => {
    
    const users = await userService.getSuggestions(
        req.user.id,
        req.validated.query
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Suggestions fetched successfully",
        data: users.data,
        meta: users.meta
    });
}
);
