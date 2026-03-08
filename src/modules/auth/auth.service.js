import sequelize from "#config/database.js";
import { OtpCode, User } from "#models/index.js";
import { sendEmail } from "#services/email.service.js";
import { generateOtp } from "#services/otp.service.js";
import { otpEmailTemplate } from "#templates/otpEmail.js";
import { welcomeEmailTemplate } from "#templates/welcomeEmailTemplate.js";
import AppError from "#utils/AppError.js";
import { Op } from "sequelize";

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

    if (otp.expiresAt < new Date()) {
        throw new AppError("OTP expired", 400);
    }

    if (otp.attemptCount >= 5) {
        throw new AppError("OTP limit exceeded", 429);
    }

    if (otp.code !== otpCode) {
        await otp.increment("attemptCount");

        throw new AppError("Invalid OTP", 400);
    }


    user.isEmailVerified = true;
    await user.save();

    await otp.update({ used: true });

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

export const resendOtp = (user) => { };

export const loginUser = (user) => { };

export const logoutUser = (user) => { };

export const verifyUser = (user) => { };

export const refreshToken = (user) => { };

export const resetPassword = (user) => { };

export const changePassword = (user) => { };

export const forgotPassword = (user) => { };
