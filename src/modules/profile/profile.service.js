import { User } from "#models/index.js";
import AppError from "#utils/AppError.js";
import Profile from "./profile.model.js";

// Get My Profile
export const getMyProfile = async (userId) => {
    const profile = await Profile.findOne({
        where: { userId },
        // attributes: ["banner", "avatar", "bio"],
        // attributes: {
        //     exclude: ["userId", "bannerPublicId", "avatarPublicId"]
        // },
        // raw: true,
        include: {
            model: User,
            attributes: ["id", "firstName", "lastName", "email", "userName"],
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
    const systemFields = ["avatarPublicId", "bannerPublicId"];

    const updateData = {};

    // user allowed
    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            updateData[key] = data[key];
        }
    }

    // system controlled
    for (const key of systemFields) {
        if (data[key] !== undefined) {
            updateData[key] = data[key];
        }
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError("No valid fields provided", 400);
    }

    await profile.update(updateData);

    const updatedProfile = await profile.reload({
        // Not work attributes in reload so we have to use toJSON method and exclude fields
        // attributes: {
        //     exclude: ["userId", "bannerPublicId", "avatarPublicId"]
        // },
        include: {
            model: User,
            attributes: ["id", "firstName", "lastName", "email", "userName"],
        }
    });

    return updatedProfile;
};