import sequelize from "#config/database.js";
import { DataTypes } from "sequelize";

const Notification = sequelize.define("notifications", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    senderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id"
        }
    },

    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },

    type: {
        // type: DataTypes.ENUM(...Object.values(NOTIFICATION_TYPES)),
        type: DataTypes.STRING,
        allowNull: false
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    entityType: {
        // type: DataTypes.ENUM(...Object.values(ENTITY_TYPES)),
        type: DataTypes.STRING,
        allowNull: true
    },

    entityId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    data: {
        type: DataTypes.JSON,
        allowNull: true
    },

    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    readAt: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    tableName: "notifications",
    timestamps: true,
    underscored: true,
    paranoid: true
});

export default Notification;
