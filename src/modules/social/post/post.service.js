import sequelize from "#config/database.js";
import { Post, Tag, User } from "#models/index.js";


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

    const posts = await Post.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ["imagePublicId", "userId", "deletedAt"] },
        order: [["createdAt", "DESC"]],
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
export const getPostById = async (id) => {

}

// Update Post
export const updatePost = async (id, data) => {

}

// Delete Post
export const deletePost = async (id) => {

}
