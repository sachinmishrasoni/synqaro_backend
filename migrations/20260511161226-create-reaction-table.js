'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reactions', {
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
        onDelete: 'CASCADE'
      },

      type: {
        type: Sequelize.ENUM('like', 'love', 'wow', 'sad', 'dislike'),
        allowNull: false
      },

      entity_type: {
        type: Sequelize.ENUM('post', 'comment'),
        allowNull: false
      },

      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    // 🔥 Unique constraint (important)
    await queryInterface.addConstraint('reactions', {
      fields: ['user_id', 'entity_type', 'entity_id'],
      type: 'unique',
      name: 'unique_user_entity_reaction'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reactions');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reactions_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reactions_entity_type";'
    );
  }
};

