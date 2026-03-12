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

export const resendOtp = asyncHandler(async (req, res) => {

    const { userId } = req.body || {};

    const result = await authService.resendEmailOtp(userId);

    sendResponse(res, {
        statusCode: 200,
        message: result.message
    });

});

export const login = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body || {};

    const result = await authService.loginUser({
        userName,
        email,
        password
    }, req.ip, req.headers["user-agent"]);

    sendResponse(res, {
        statusCode: 200,
        message: "Login successful",
        data: result
    });
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body || {};

    const result = await authService.refreshAccessToken(refreshToken);

    sendResponse(res, {
        statusCode: 200,
        message: "Token refreshed successfully",
        data: result
    });
});

export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body || {};

    const result = await authService.logoutUser(refreshToken);

    sendResponse(res, {
        statusCode: 200,
        message: result.message
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body || {};

    const result = await authService.forgotPassword(email);

    sendResponse(res, {
        message: result.message,
        data: {
            userId: result.userId
        }
    });
});

export const verifyResetOtp = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body || {};

    const result = await authService.verifyResetOtp(userId, otp);

    sendResponse(res, {
        message: result.message,
        data: {
            userId: result.userId
        }
    });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { userId, password } = req.body || {};

    const result = await authService.resetPassword(userId, password);

    sendResponse(res, {
        statusCode: 200,
        message: result.message
    });
});

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body || {};

    const result = await authService.changePassword(req.user.id, oldPassword, newPassword);

    sendResponse(res, {
        statusCode: 200,
        message: result.message
    });
});
