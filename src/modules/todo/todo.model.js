import sequelize from "#config/database.js";
import { TODO_PRIORITY, TODO_STATUS } from "#constants/todo.constants.js";
import { DataTypes } from "sequelize";

const Todo = sequelize.define("Todo", {
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
        },
    },

    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "todos",
            key: "id",
        },
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 255],
        },
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    priority: {
        type: DataTypes.ENUM(...Object.values(TODO_PRIORITY)),
        defaultValue: TODO_PRIORITY.MEDIUM,
    },

    status: {
        type: DataTypes.ENUM(...Object.values(TODO_STATUS)),
        defaultValue: TODO_STATUS.PENDING,
    },

    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    archivedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },

}, {
    tableName: "todos",
    timestamps: true,
    underscored: true,
    paranoid: true,

    indexes: [
        {
            fields: ["userId"],
        },
        {
            fields: ["parentId"],
        },
        {
            fields: ["status"],
        },
        {
            fields: ["priority"],
        },
        {
            fields: ["dueDate"],
        },
    ],
});

export default Todo;
