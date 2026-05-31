
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
    const currentUserId = req.user.id;

    const posts = await postService.getPosts(req.query, currentUserId);

    sendResponse(res, {
        statusCode: 200,
        message: "Posts fetched successfully",
        data: posts.data,
        meta: posts.meta
    });
});

export const getPostById = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    const post = await postService.getPostById(postId, userId);

    sendResponse(res, {
        statusCode: 200,
        message: "Post fetched successfully",
        data: post
    });
});

export const updatePost = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    const { title, content, status, tags } = req.body || {};

    // if (!title || !content) {
    //     throw new AppError("Title and content are required", 400);
    // }

    let imageData = {};
    if (req.file) {
        const result = await uploadImage(req.file.buffer, "posts");

        imageData = {
            image: result.secure_url,
            imagePublicId: result.public_id
        };
    }

    let publishData = {};
    if (status === "published") {
        publishData.publishedAt = new Date();
    }

    let parsedTags = [];
    if (tags) {
        parsedTags = typeof tags === "string"
            ? tags.split(",").map(t => t.trim().toLowerCase())
            : tags.map(t => t.trim().toLowerCase());
    }

    const post = await postService.updatePost(userId, postId, {
        title,
        content,
        status,
        tags: parsedTags,
        ...imageData,
        ...publishData
    });

    sendResponse(res, {
        statusCode: 200,
        message: "Post updated successfully",
        data: post
    });
});

export const deletePost = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    await postService.deletePost(userId, postId);

    sendResponse(res, {
        statusCode: 200,
        message: "Post deleted successfully",
        data: {
            id: postId
        }
    });
});
