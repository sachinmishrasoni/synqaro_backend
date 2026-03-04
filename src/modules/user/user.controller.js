import AppError from "../../shared/utils/AppError.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/sendResponse.js";
import User from "./user.model.js";

// Create User
export const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body || {};

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const user = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password
    });

    sendResponse(res, {
        statusCode: 201,
        message: "User created successfully",
        data: user
    });
});
