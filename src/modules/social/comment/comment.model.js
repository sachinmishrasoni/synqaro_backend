import sequelize from "#config/database.js";
import { DataTypes } from "sequelize";

const Comment = sequelize.define("comments", {
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
            key: "id"
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "posts",
            key: "id"
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "comments",
            key: "id"
        }
    },
}, {
    tableName: "comments",
    timestamps: true,
    underscored: true,
    paranoid: true
});

export default Comment;
