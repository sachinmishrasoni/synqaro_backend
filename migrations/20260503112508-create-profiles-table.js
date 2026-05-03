'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profiles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      banner: {
        type: Sequelize.STRING,
        allowNull: true
      },

      avatar: {
        type: Sequelize.STRING,
        allowNull: true
      },

      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      location: {
        type: Sequelize.STRING,
        allowNull: true
      },

      dob: {
        type: Sequelize.DATE,
        allowNull: true
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },

      passion: {
        type: Sequelize.STRING,
        allowNull: true
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

    // Index for performance
    await queryInterface.addIndex('profiles', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('profiles');
  }
};
