import sequelize from "#config/database.js";
import { AuthToken, OtpCode, User } from "#models/index.js";
import { sendEmail } from "#services/email.service.js";
import { generateOtp } from "#services/otp.service.js";
import { otpEmailTemplate } from "#templates/otpEmail.js";
import { welcomeEmailTemplate } from "#templates/welcomeEmailTemplate.js";
import AppError from "#utils/AppError.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "#services/jwt.service.js";

// export const registerUser = async (data) => {
//     const { firstName, lastName, userName, email, password } = data || {};

//     const existingUser = await User.findOne({
//         where: {
//             [Op.or]: [{ email }, { userName }]
//         }
//     });

//     if (existingUser) {
//         throw new AppError("User already exists", 400);
//     }

//     const user = await User.create({
//         firstName,
//         lastName,
//         userName,
//         email,
//         password,
//         isEmailVerified: false
//     });

//     const otp = generateOtp();

//     await OtpCode.create({
//         userId: user.id,
//         code: otp,
//         type: "email_verification",
//         expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//         used: false
//     });

//     await sendEmail(user.email, "Verify your email", `Your OTP is ${otp}`);

//     return {
//         id: user.id,
//         userName: user.userName,
//         email: user.email,
//     };
// };

export const registerUser = async (data) => {
    const { firstName, lastName, userName, email, password } = data || {};

    const transaction = await sequelize.transaction();

    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { userName }]
            },
            transaction
        });

        // Case 1: User exists and verified
        if (existingUser && existingUser.isEmailVerified) {
            throw new AppError("User already exists", 400);
        }

        let user;

        // Case 2: User exists but not verified
        if (existingUser && !existingUser.isEmailVerified) {
            user = existingUser;

            // delete previous OTPs
            await OtpCode.destroy({
                where: {
                    userId: user.id,
                    type: "email_verification"
                },
                transaction
            });
        } else {
            user = await User.create({
                firstName,
                lastName,
                userName,
                email,
                password,
                isEmailVerified: false
            }, { transaction });
        }

        const otp = generateOtp();

        await OtpCode.create({
            userId: user.id,
            code: otp,
            type: "email_verification",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            used: false,
            attemptCount: 0
        }, { transaction });

        await transaction.commit();

        // await sendEmail(user.email, "Verify your email", `Your OTP is ${otp}`);

        await sendEmail({
            to: user.email,
            subject: "Verify your email",
            // text: `Your OTP is ${otp}`,
            html: otpEmailTemplate({ otp }),
        })

        return {
            id: user.id,
            userName: user.userName,
            email: user.email,
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const verifyEmailOtp = async (userId, otpCode) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
        throw new AppError("Email already verified", 400);
    }

    const otp = await OtpCode.findOne({
        where: {
            userId,
            type: "email_verification",
            used: false
        },
        order: [["createdAt", "DESC"]]
    })

    if (!otp) {
        throw new AppError("Invalid OTP", 400);
    }

    // Attempt limit exceeded
    if (otp.attemptCount >= 5) {

        await otp.update({ used: true });

        throw new AppError(
            "Too many incorrect attempts. Please request a new OTP.",
            429
        );
    }

    // Attempt limit exceeded
    if (otp.attemptCount >= 5) {

        await otp.update({ used: true });

        throw new AppError(
            "Too many incorrect attempts. Please request a new OTP.",
            429
        );
    }

    // Wrong OTP
    if (otp.code !== otpCode) {

        await otp.increment("attemptCount");

        const remainingAttempts = 5 - (otp.attemptCount + 1);

        throw new AppError(
            `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
            400
        );
    }

    // OTP correct → verify user
    user.isEmailVerified = true;
    await user.save();

    // Invalidate OTP
    await otp.update({ used: true });

    // Send welcome email
    await sendEmail({
        to: user.email,
        subject: "Account Created Successfully",
        html: welcomeEmailTemplate({ name: user.firstName }),
    })

    return {
        id: user.id,
        userName: user.userName,
        email: user.email,
    };
};

export const resendEmailOtp = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
        throw new AppError("Email already verified", 400);
    }

    const lastOtp = await OtpCode.findOne({
        where: {
            userId,
            type: "email_verification",
            used: false
        },
        order: [["createdAt", "DESC"]]
    })

    // cooldown (60 sec)
    if (lastOtp && Date.now() - new Date(lastOtp.createdAt).getTime() < 60000) {
        throw new AppError("Please wait before requesting another OTP", 429);
    }

    // delete previous OTPs
    await OtpCode.destroy({
        where: {
            userId,
            type: "email_verification"
        }
    });

    const otp = generateOtp();

    await OtpCode.create({
        userId,
        code: otp,
        type: "email_verification",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        used: false,
        attemptCount: 0
    });

    await sendEmail({
        to: user.email,
        subject: "Resend Email Verification OTP",
        html: otpEmailTemplate({ otp })
    });

    return {
        message: "OTP sent successfully"
    };

};

export const loginUser = async ({ userName, email, password }, ipAddress, deviceInfo) => {
    const where = email ? { email } : { userName };

    const user = await User.scope("withPassword").findOne({
        where
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!user.isEmailVerified) {
        throw new AppError("Email not verified", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
    }

    const payload = {
        id: user.id,
        userName: user.userName,
        email: user.email
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await AuthToken.create({
        userId: user.id,
        refreshToken,
        deviceInfo: deviceInfo,
        ipAddress: ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
        user: {
            id: user.id,
            userName: user.userName,
            email: user.email
        },
        accessToken,
        refreshToken,
    }
};

export const refreshAccessToken = async (refreshToken) => {
    let decoded;

    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new AppError("Invalid refresh token", 401);
    }

    const session = await AuthToken.findOne({
        where: {
            userId: decoded.id,
            refreshToken
        }
    });

    if (!session) {
        throw new AppError("Invalid refresh token", 401);
    }

    if (session.expiresAt < Date.now()) {
        throw new AppError("Refresh token expired", 401);
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const newAccessToken = generateAccessToken({
        id: user.id,
        userName: user.userName,
        email: user.email
    });

    return {
        accessToken: newAccessToken
    }
};

export const logoutUser = (user) => { };

export const verifyUser = (user) => { };

export const resetPassword = (user) => { };

export const changePassword = (user) => { };

export const forgotPassword = (user) => { };
