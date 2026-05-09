'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tags', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // 🔥 Index for fast lookup
    await queryInterface.addIndex('tags', ['name'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tags');
  }
};