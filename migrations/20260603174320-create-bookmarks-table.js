'use strict';

export async function up(queryInterface, Sequelize) {

    await queryInterface.createTable("bookmarks", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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

        entity_type: {
            type: Sequelize.STRING,
            allowNull: false
        },

        entity_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal(
                "CURRENT_TIMESTAMP"
            )
        },

        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal(
                "CURRENT_TIMESTAMP"
            )
        }
    });

    await queryInterface.addIndex(
        "bookmarks",
        [
            "user_id",
            "entity_type",
            "entity_id"
        ],
        {
            unique: true,
            name: "idx_bookmarks_unique"
        }
    );

    await queryInterface.addIndex(
        "bookmarks",
        ["user_id"],
        {
            name: "idx_bookmarks_user"
        }
    );

    await queryInterface.addIndex(
        "bookmarks",
        [
            "entity_type",
            "entity_id"
        ],
        {
            name: "idx_bookmarks_entity"
        }
    );
}

export async function down(queryInterface) {
    await queryInterface.dropTable(
        "bookmarks"
    );
}
