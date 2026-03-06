import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as authService from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);

    sendResponse(res, {
        statusCode: 201,
        message: "Otp sent successfully",
        data: user.userId
    });
});

export const login = asyncHandler(async (req, res) => {

});