import sequelize from "#config/database.js";

export const getPostMetaAttributes = (userId) => {
    return [
        [
            sequelize.literal(`(
                SELECT COUNT(*)
                FROM reactions r
                WHERE r.entity_type = 'post'
                AND r.entity_id = Post.id
            )`),
            "reactionCount"
        ],

        [
            sequelize.literal(`(
                SELECT COUNT(*)
                FROM comments c
                WHERE c.post_id = Post.id
                AND c.deleted_at IS NULL
            )`),
            "commentCount"
        ],

        [
            sequelize.literal(`(
                SELECT type
                FROM reactions r
                WHERE r.entity_type = 'post'
                AND r.entity_id = Post.id
                AND r.user_id = ${userId}
                LIMIT 1
            )`),
            "myReaction"
        ],

        [
            sequelize.literal(`
                EXISTS (
                    SELECT 1
                    FROM bookmarks b
                    WHERE b.user_id = ${userId}
                    AND b.entity_type = 'post'
                    AND b.entity_id = Post.id
                )
            `),
            "isBookmarked"
        ]
    ];
};

export const normalizePost = (post) => {
    const data = post.toJSON();

    data.reactionCount = Number(data.reactionCount || 0);
    data.commentCount = Number(data.commentCount || 0);
    data.isBookmarked = Boolean(data.isBookmarked);

    return data;
};
