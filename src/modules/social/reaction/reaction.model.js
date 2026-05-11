import sequelize from "#config/database.js";
import { DataTypes } from "sequelize";

const Reaction = sequelize.define("reactions", {
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
    type: {
        type: DataTypes.ENUM("like", "love", "wow", "sad", "dislike"),
        allowNull: false
    },
    entityType: {
        type: DataTypes.ENUM("post", "comment"),
        allowNull: false
    },
    entityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "reactions",
    timestamps: true,
    underscored: true,

    indexes: [
        {
            unique: true,
            fields: ["userId", "entityType", "entityId"]
        }
    ]
});

export default Reaction;
