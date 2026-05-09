'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_tags', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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

    // 🔥 Prevent duplicate mappings (VERY IMPORTANT)
    await queryInterface.addConstraint('post_tags', {
      fields: ['post_id', 'tag_id'],
      type: 'unique',
      name: 'unique_post_tag'
    });

    // 🔥 Index for performance
    await queryInterface.addIndex('post_tags', ['post_id']);
    await queryInterface.addIndex('post_tags', ['tag_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('post_tags');
  }
};
