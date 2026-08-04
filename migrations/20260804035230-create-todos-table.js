'use strict';

import {
  TODO_PRIORITY,
  TODO_STATUS,
} from "#constants/todo.constants.js";

export async function up(queryInterface, Sequelize) {

  await queryInterface.createTable("todos", {

    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    parent_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "todos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    priority: {
      type: Sequelize.ENUM(
        ...Object.values(TODO_PRIORITY)
      ),
      allowNull: false,
      defaultValue: TODO_PRIORITY.MEDIUM,
    },

    status: {
      type: Sequelize.ENUM(
        ...Object.values(TODO_STATUS)
      ),
      allowNull: false,
      defaultValue: TODO_STATUS.PENDING,
    },

    due_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    completed_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    archived_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    sort_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

  });

  await queryInterface.addIndex(
    "todos",
    ["user_id"],
    {
      name: "idx_todos_user",
    }
  );

  await queryInterface.addIndex(
    "todos",
    ["parent_id"],
    {
      name: "idx_todos_parent",
    }
  );

  await queryInterface.addIndex(
    "todos",
    ["status"],
    {
      name: "idx_todos_status",
    }
  );

  await queryInterface.addIndex(
    "todos",
    ["priority"],
    {
      name: "idx_todos_priority",
    }
  );

  await queryInterface.addIndex(
    "todos",
    ["due_date"],
    {
      name: "idx_todos_due_date",
    }
  );

  await queryInterface.addIndex(
    "todos",
    ["user_id", "status"],
    {
      name: "idx_todos_user_status",
    }
  );

  await queryInterface.addIndex(
    "todos",
    ["user_id", "parent_id"],
    {
      name: "idx_todos_user_parent",
    }
  );

  await queryInterface.addIndex(
    "todos",
    ["user_id", "sort_order"],
    {
      name: "idx_todos_user_sort_order",
    }
  );
}

export async function down(queryInterface) {

  await queryInterface.dropTable("todos");

  await queryInterface.sequelize.query(
    "DROP TYPE IF EXISTS enum_todos_priority;"
  );

  await queryInterface.sequelize.query(
    "DROP TYPE IF EXISTS enum_todos_status;"
  );
}
