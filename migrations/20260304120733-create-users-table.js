'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      last_name: {
        type: Sequelize.STRING,
        allowNull: true
      },

      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      role: {
        type: Sequelize.ENUM("admin", "user"),
        defaultValue: "user"
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      status: {
        type: Sequelize.ENUM("active", "suspended", "banned"),
        defaultValue: "active"
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};