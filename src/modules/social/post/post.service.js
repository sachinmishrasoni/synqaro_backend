import sequelize from "#config/database.js";
import { Post, Tag, User } from "#models/index.js";
import AppError from "#utils/AppError.js";
import { Op } from "sequelize";


// Create Post
export const createPost = async (userId, data) => {
    const transaction = await sequelize.transaction();

    try {
        const { tags = [], ...postData } = data;

        // Step 1: Create post
        const post = await Post.create({
            userId,
            ...postData
        }, { transaction });

        // Step 2: Handle tags
        if (tags.length > 0) {
            const uniqueTags = [...new Set(tags)];

            const existingTags = await Tag.findAll({
                where: { name: uniqueTags },
                transaction
            });

            const existingNames = existingTags.map(tag => tag.name);

            const newTags = uniqueTags
                .filter(tag => !existingNames.includes(tag))
                .map(name => ({ name }));

            let createdTags = [];
            if (newTags.length > 0) {
                createdTags = await Tag.bulkCreate(newTags, { transaction });
            }

            const allTags = [...existingTags, ...createdTags];

            // console.log("uniqueTags", uniqueTags);
            // console.log("existingNames", existingNames);
            // console.log("newTags", newTags);
            // console.log("createdTags", createdTags);
            // console.log("allTags", allTags);

            await post.setTags(allTags, { transaction });
        }

        await transaction.commit();

        // Step 3: Fetch full data with relations
        const fullPost = await Post.findByPk(post.id, {
            attributes: { exclude: ["imagePublicId"] },
            include: [
                {
                    model: Tag,
                    as: "tags",
                    attributes: ["id", "name"],
                    through: { attributes: [] } // hide post_tags
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "firstName", "lastName", "email", "userName"]
                },
            ]
        });

        return fullPost;

    } catch (error) {
        // await transaction.rollback();
        if (!transaction.finished) {
            await transaction.rollback();
        }
        throw error;
    }
};

// Get Posts
export const getPosts = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { userId, tag, search, status } = query;

    const where = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (search) where.title = {
        [Op.like]: `%${search}%`
    };

    const include = [
        {
            model: Tag,
            as: "tags",
            attributes: ["id", "name"],
            through: { attributes: [] }, // hide post_tags
            ...(tag && { where: { name: tag } })
        },
        {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "userName"]
        },
    ];

    const posts = await Post.findAndCountAll({
        where,
        include,
        distinct: true,
        limit,
        offset,
        attributes: { exclude: ["imagePublicId", "userId", "deletedAt"] },
        order: [["createdAt", "DESC"]],
    });

    return {
        meta: {
            total: posts.count,
            page,
            limit,
            totalPages: Math.ceil(posts.count / limit)
        },
        data: posts.rows
    };
}

// Get Post by Id
export const getPostById = async (postId) => {
    const post = await Post.findByPk(postId, {
        attributes: { exclude: ["imagePublicId", "userId", "deletedAt"] },
        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: { attributes: [] }
            },
            {
                model: User,
                as: "user",
                attributes: ["id", "firstName", "lastName", "email", "userName"]
            },
        ]
    });

    if (!post) {
        throw new AppError("Post not found", 404);
    }

    return post;
}

// Update Post
export const updatePost = async (id, data) => {

}

// Delete Post
export const deletePost = async (id) => {

}
