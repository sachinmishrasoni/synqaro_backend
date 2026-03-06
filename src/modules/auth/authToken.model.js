import { DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

const authToken = sequelize.define("AuthToken", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        }
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deviceInfo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: "auth_tokens",
    timestamps: true,
    underscored: true
});

export default authToken;
