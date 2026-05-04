'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      image: {
        type: Sequelize.STRING,
        allowNull: true
      },

      image_public_id: {
        type: Sequelize.STRING,
        allowNull: true
      },

      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      status: {
        type: Sequelize.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft'
      },

      published_at: {
        type: Sequelize.DATE,
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
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // 🔥 Indexes
    await queryInterface.addIndex('posts', ['user_id']);
    await queryInterface.addIndex('posts', ['slug'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');

    // ENUM cleanup (important in MySQL/Postgres)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_posts_status";').catch(() => {});
  }
};
