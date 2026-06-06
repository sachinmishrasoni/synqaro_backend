import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as bookmarkService from "./bookmark.service.js";

export const toggleBookmark = asyncHandler(async (req, res) => {

    const { entityType, entityId } = req.validated.body;

    const result = await bookmarkService.toggleBookmark(
        req.user.id,
        entityType,
        entityId
    );

    sendResponse(res, {
        statusCode: 200,
        message:
            result.action === "saved"
                ? "Bookmark added successfully"
                : "Bookmark removed successfully",
        data: result
    });
});

export const getBookmarks = asyncHandler(async (req, res) => {

    const bookmarks = await bookmarkService.getBookmarks(
        req.user.id,
        req.validated.query
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Bookmarks fetched successfully",
        data: bookmarks.data,
        meta: bookmarks.meta
    });
});

export const removeBookmark = asyncHandler(async (req, res) => {

    const result = await bookmarkService.removeBookmark(
        req.user.id,
        req.validated.params.bookmarkId
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Bookmark removed successfully",
        data: result
    });
});
