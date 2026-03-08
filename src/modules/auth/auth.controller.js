import AppError from "#utils/AppError.js";
import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as authService from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);

    sendResponse(res, {
        statusCode: 200,
        message: "Otp sent successfully",
        data: user
    });
});

export const verifyEmailOtp = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body || {};

    if (!userId || !otp) {
        throw new AppError("Invalid request", 400);
    }

    const user = await authService.verifyEmailOtp(userId, otp);

    sendResponse(res, {
        statusCode: 200,
        message: "Email verified successfully",
        data: user
    });
});

export const resendEmailOtp = asyncHandler(async (req, res) => {

});

export const login = asyncHandler(async (req, res) => {

});