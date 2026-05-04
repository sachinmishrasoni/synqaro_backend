import sequelize from "#config/database.js";
import { DataTypes } from "sequelize";
import slugify from "slugify";


const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imagePublicId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM("draft", "published"),
        defaultValue: "draft"
    },

    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },

}, {
    tableName: "posts",
    timestamps: true,
    underscored: true,
    paranoid: true,

    indexes: [
        { fields: ["userId"] },
        {
            unique: true,
            fields: ["slug"]
        },
    ],

    hooks: {
        beforeValidate: (post) => {
            if (post.title) {
                post.slug = `${slugify(post.title, { lower: true, strict: true })}-${Date.now()}`;
            }
        }
    }
});

export default Post;
