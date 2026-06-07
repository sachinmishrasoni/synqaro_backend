'use strict';

export async function up(queryInterface, Sequelize) {

  await queryInterface.createTable("blocks", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    blocker_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },

    blocked_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
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
    }
  });

  await queryInterface.addIndex(
    "blocks",
    [
      "blocker_id",
      "blocked_id"
    ],
    {
      unique: true,
      name: "idx_blocks_unique"
    }
  );

  await queryInterface.addIndex(
    "blocks",
    ["blocker_id"],
    {
      name: "idx_blocks_blocker"
    }
  );

  await queryInterface.addIndex(
    "blocks",
    ["blocked_id"],
    {
      name: "idx_blocks_blocked"
    }
  );
}

export async function down(queryInterface) {
  await queryInterface.dropTable("blocks");
}
