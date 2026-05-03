import { deleteImage, uploadImage } from "#services/upload.service.js";
import AppError from "#utils/AppError.js";
import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import { formatProfile } from "./profile.formatter.js";
import * as profileService from "./profile.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await profileService.getMyProfile(userId);


    sendResponse(res, {
        statusCode: 200,
        message: "Profile fetched successfully",
        data: formatProfile(profile)
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await profileService.updateProfile(userId, req.body);

    sendResponse(res, {
        statusCode: 200,
        message: "Profile updated successfully",
        data: formatProfile(profile)
    });
});

// Avatar
export const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new AppError("File is required", 400);
    }

    const result = await uploadImage(req.file.buffer, "avatars");

    // console.log("result",req.file, result);
    const profile = await profileService.updateProfile(req.user.id, {
        avatar: result.secure_url,
        avatarPublicId: result.public_id
    });

    sendResponse(res, {
        statusCode: 200,
        message: "Avatar uploaded",
        data: formatProfile(profile)
    });
});


export const deleteAvatar = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await profileService.getMyProfile(userId);

    if (!profile.avatarPublicId) {
        throw new AppError("No avatar to delete", 400);
    }

    await deleteImage(profile.avatarPublicId);

    const updatedProfile = await profileService.updateProfile(userId, {
        avatar: null,
        avatarPublicId: null
    });

    sendResponse(res, {
        statusCode: 200,
        message: "Avatar deleted successfully",
        data: formatProfile(updatedProfile)
    });
});
