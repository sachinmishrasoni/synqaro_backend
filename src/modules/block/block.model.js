import sequelize from "#config/database.js";
import { DataTypes } from "sequelize";

const Block = sequelize.define("blocks", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    blockerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },

    blockedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    }

}, {
    tableName: "blocks",
    timestamps: true,
    underscored: true,

    indexes: [
        {
            unique: true,
            fields: [
                "blockerId",
                "blockedId"
            ]
        }
    ]
});

export default Block;
