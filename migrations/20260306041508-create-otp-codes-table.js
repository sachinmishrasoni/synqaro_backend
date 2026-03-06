export default {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("otp_codes", {

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
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      code: {
        type: Sequelize.STRING(10),
        allowNull: false
      },

      type: {
        type: Sequelize.ENUM("email_verification", "password_reset"),
        allowNull: false
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      attempt_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable("otp_codes");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_otp_codes_type";'
    );

  }
};
