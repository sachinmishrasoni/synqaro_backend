import sequelize from "#config/database.js";
import { DataTypes } from "sequelize";

const Bookmark = sequelize.define("bookmarks", {
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

    entityType: {
        type: DataTypes.STRING,
        allowNull: false
    },

    entityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "bookmarks",
    timestamps: true,
    underscored: true,

    indexes: [
        {
            unique: true,
            fields: [
                "userId",
                "entityType",
                "entityId"
            ]
        }
    ]
});

export default Bookmark;
