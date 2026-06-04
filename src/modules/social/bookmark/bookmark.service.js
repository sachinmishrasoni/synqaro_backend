import { Post, Tag, User } from "#models/index.js";
import AppError from "#utils/AppError.js";
import { getPagination, getPaginationMeta } from "#utils/pagination.utils.js";
import Bookmark from "./bookmark.model.js";
import { validateEntity } from "./bookmark.utils.js";


export const toggleBookmark = async (userId, entityType, entityId) => {

    await validateEntity(entityType, entityId);

    const bookmark = await Bookmark.findOne({
        where: {
            userId,
            entityType,
            entityId
        }
    });

    if (bookmark) {
        await bookmark.destroy();

        return {
            action: "removed"
        };
    }

    await Bookmark.create({
        userId,
        entityType,
        entityId
    });

    return {
        action: "saved"
    };
};

export const getBookmarks = async (userId, query) => {

    const { page, limit, offset } = getPagination(query);

    const bookmarks = await Bookmark.findAndCountAll({
        where: {
            userId,
            entityType: "post"
        },
        order: [["createdAt", "DESC"]],
        limit,
        offset
    });

    const postIds = bookmarks.rows.map(
        bookmark => bookmark.entityId
    );

    const posts = await Post.findAll({
        where: {
            id: postIds
        },
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "firstName", "lastName", "email", "userName"]
            },
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: {
                    attributes: []
                }
            }
        ]
    });

    const postsMap = new Map(posts.map(post => [post.id, post]));

    const orderedPosts = postIds
        .map(id => postsMap.get(id))
        .filter(Boolean);

    return {
        meta: getPaginationMeta(
            bookmarks.count,
            page,
            limit
        ),
        data: orderedPosts
    };
};

export const removeBookmark = async (userId, bookmarkId) => {

    const bookmark = await Bookmark.findOne({
        where: {
            id: bookmarkId,
            userId
        }
    });

    if (!bookmark) {
        throw new AppError("Bookmark not found", 404);
    }

    await bookmark.destroy();

    return {
        id: bookmarkId
    };
};

