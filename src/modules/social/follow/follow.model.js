import sequelize from "#config/database.js";
import { DataTypes } from "sequelize";

const Follow = sequelize.define("Follow", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },

    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    }

}, {
    tableName: "follows",
    timestamps: true,
    underscored: true,

    indexes: [
        {
            unique: true,
            fields: ["followerId", "followingId"]
        }
    ]
});

export default Follow;
