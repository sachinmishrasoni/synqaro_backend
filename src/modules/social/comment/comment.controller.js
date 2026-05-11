import AppError from "#utils/AppError.js";
import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as commentService from "./comment.service.js";

export const createComment = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    const { content, parentId } = req.body || {};

    if (!postId || !content) {
        throw new AppError("Post id and content are required", 400);
    }

    const comment = await commentService.createComment(userId, {
        postId,
        content,
        parentId
    });

    sendResponse(res, {
        statusCode: 201,
        message: "Comment created successfully",
        data: comment
    });
});
