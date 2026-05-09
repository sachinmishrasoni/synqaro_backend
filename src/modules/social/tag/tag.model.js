import sequelize from "#config/database.js";
import { DataTypes } from "sequelize";

const Tag = sequelize.define("Tag", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: "tags",
    timestamps: true,
    underscored: true,
    paranoid: true
});

export default Tag;
