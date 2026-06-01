'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("follows", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        follower_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        },

        following_id: {
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
        "follows",
        ["follower_id", "following_id"],
        {
            unique: true,
            name: "unique_follower_following"
        }
    );
}

export async function down(queryInterface) {
    await queryInterface.dropTable("follows");
}