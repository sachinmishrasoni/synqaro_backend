'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("auth_tokens", {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },

      refresh_token: {
        type: Sequelize.STRING,
        allowNull: false
      },

      device_info: {
        type: Sequelize.STRING,
        allowNull: false
      },

      ip_address: {
        type: Sequelize.STRING,
        allowNull: false
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }

    });

  },

  async down(queryInterface) {

    await queryInterface.dropTable("auth_tokens");

  }
};
