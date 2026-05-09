
import asyncHandler from "#utils/asyncHandler.js";
import { uploadImage } from "#services/upload.service.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as postService from "./post.service.js";
import AppError from "#utils/AppError.js";

export const createPost = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const { title, content, status, tags } = req.body || {};

    if (!title || !content) {
        throw new AppError("Title and content are required", 400);
    }

    // Upload image (optional)
    let imageData = {};
    if (req.file) {
        const result = await uploadImage(req.file.buffer, "posts");

        imageData = {
            image: result.secure_url,
            imagePublicId: result.public_id
        };
    }

    // Publish logic
    let publishData = {};
    if (status === "published") {
        publishData.publishedAt = new Date();
    }

    // Parse tags (string → array)
    let parsedTags = [];
    if (tags) {
        parsedTags = typeof tags === "string"
            ? tags.split(",").map(t => t.trim().toLowerCase())
            : tags.map(t => t.trim().toLowerCase());
    }

    const post = await postService.createPost(userId, {
        title,
        content,
        status,
        tags: parsedTags,
        ...imageData,
        ...publishData
    });

    sendResponse(res, {
        statusCode: 201,
        message: "Post created successfully",
        data: post
    });
});

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await postService.getPosts(req.query);

    sendResponse(res, {
        statusCode: 200,
        message: "Posts fetched successfully",
        data: posts.data,
        meta: posts.meta
    });
});
