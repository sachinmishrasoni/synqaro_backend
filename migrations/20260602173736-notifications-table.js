'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("notifications", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    sender_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    },

    receiver_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },

    type: {
      type: Sequelize.STRING,
      allowNull: false
    },

    title: {
      type: Sequelize.STRING,
      allowNull: false
    },

    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },

    entity_type: {
      type: Sequelize.STRING,
      allowNull: true
    },

    entity_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },

    data: {
      type: Sequelize.JSON,
      allowNull: true
    },

    is_read: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    read_at: {
      type: Sequelize.DATE,
      allowNull: true
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },

    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  await queryInterface.addIndex(
    "notifications",
    ["receiver_id", "is_read"],
    {
      name: "idx_notifications_receiver_read"
    }
  );

  await queryInterface.addIndex(
    "notifications",
    ["type"],
    {
      name: "idx_notifications_type"
    }
  );

  await queryInterface.addIndex(
    "notifications",
    ["entity_type", "entity_id"],
    {
      name: "idx_notifications_entity"
    }
  );
}

export async function down(queryInterface) {
  await queryInterface.dropTable("notifications");
}
