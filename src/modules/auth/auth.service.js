import { OtpCode, User } from "#models/index.js";
import AppError from "#utils/AppError.js";
import { generateOtp } from "#utils/generateOtp.js";
import { sendEmail } from "#utils/sendEmail.js";
import { Op } from "sequelize";

export const registerUser = async (data) => {
    const { firstName, lastName, userName, email, password } = data || {};

    const existingUser = await User.findOne({
        where: {
            [Op.or]: [{ email }, { userName }]
        }
    });

    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const user = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password,
        isEmailVerified: false
    });

    const otp = generateOtp();

    await OtpCode.create({
        userId: user.id,
        code: otp,
        type: "email_verification",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        used: false
    });

    await sendEmail(user.email, "Verify your email", `Your OTP is ${otp}`);

    return {
        userId: user.id,
    };
};

export const loginUser = (user) => { };

export const logoutUser = (user) => { };

export const verifyUser = (user) => { };

export const refreshToken = (user) => { };

export const resetPassword = (user) => { };

export const changePassword = (user) => { };

export const forgotPassword = (user) => { };
