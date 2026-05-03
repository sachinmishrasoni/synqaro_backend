import { User } from "#models/index.js";
import AppError from "#utils/AppError.js";
import Profile from "./profile.model.js";

// Get My Profile
export const getMyProfile = async (userId) => {
    const profile = await Profile.findOne({
        where: { userId },
        // attributes: ["banner", "avatar", "bio"],
        attributes: {
            exclude: ["userId"]
        },
        // raw: true,
        include: {
            model: User,
            attributes: ["id", "first_name", "last_name", "email", "user_name"],
        }
    });

    if (!profile) {
        throw new AppError("Profile not found", 404);
    }

    return profile;
};

// Update Profile
export const updateProfile = async (userId, data) => {
    const profile = await Profile.findOne({ where: { userId } });

    if (!profile) {
        throw new AppError("Profile not found", 404);
    }

    const allowedFields = ["banner", "avatar", "bio", "location", "dob", "phone", "passion"];

    const updateData = {};
    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            updateData[key] = data[key];
        }
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError("No valid fields provided", 400);
    }

    await profile.update(updateData);

    const updatedProfile = await profile.reload({
        where: { userId },
        attributes: {
            exclude: ["userId"]
        },
        include: {
            model: User,
            attributes: ["id", "first_name", "last_name", "email", "user_name"],
        }
    });

    return updatedProfile;
};