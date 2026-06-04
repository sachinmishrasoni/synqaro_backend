import { Post } from "#models/index.js";
import AppError from "#utils/AppError.js";

export const validateEntity = async (entityType, entityId) => {

    switch (entityType) {

        case "post": {

            const post = await Post.findByPk(entityId);
            if (!post) {
                throw new AppError("Post not found", 404);
            }
            break;
        }

        default:
            throw new AppError("Unsupported entity type", 400);
    }
};
