'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('profiles', 'avatar_public_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'banner_public_id', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('profiles', 'avatar_public_id');
    await queryInterface.removeColumn('profiles', 'banner_public_id');
  }
};