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

export const updateMedia = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    let updateData = {};

    // avatar
    if (req.files?.avatar) {
        const result = await uploadImage(req.files.avatar[0].buffer, "avatars");

        updateData.avatar = result.secure_url;
        updateData.avatarPublicId = result.public_id;
    }

    // banner
    if (req.files?.banner) {
        const result = await uploadImage(req.files.banner[0].buffer, "banners");

        updateData.banner = result.secure_url;
        updateData.bannerPublicId = result.public_id;
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError("No files provided", 400);
    }

    const profile = await profileService.updateProfile(userId, updateData);

    sendResponse(res, {
        statusCode: 200,
        message: "Media updated",
        data: formatProfile(profile)
    });
});

// Banner
export const uploadBanner = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new AppError("File is required", 400);
    }

    const result = await uploadImage(req.file.buffer, "banners");

    const profile = await profileService.updateProfile(req.user.id, {
        banner: result.secure_url,
        bannerPublicId: result.public_id
    });

    sendResponse(res, {
        statusCode: 200,
        message: "Banner uploaded",
        data: formatProfile(profile)
    });
});

export const deleteBanner = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await profileService.getMyProfile(userId);

    if (!profile.bannerPublicId) {
        throw new AppError("No banner to delete", 400);
    }

    await deleteImage(profile.bannerPublicId);

    const updatedProfile = await profileService.updateProfile(userId, {
        banner: null,
        bannerPublicId: null
    });

    sendResponse(res, {
        statusCode: 200,
        message: "Banner deleted successfully",
        data: formatProfile(updatedProfile)
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
