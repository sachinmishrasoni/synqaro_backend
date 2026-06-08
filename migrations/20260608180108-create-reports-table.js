'use strict';

import { REPORT_STATUS } from "#constants/report.constants.js";

export async function up(queryInterface, Sequelize) {

    await queryInterface.createTable("reports", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        reporter_id: {
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

        reason: {
            type: Sequelize.STRING,
            allowNull: false
        },

        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        status: {
            type: Sequelize.ENUM(
                ...Object.values(REPORT_STATUS)
            ),
            allowNull: false,
            defaultValue: REPORT_STATUS.PENDING
        },

        reviewed_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        },

        reviewed_at: {
            type: Sequelize.DATE,
            allowNull: true
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
        "reports",
        ["reporter_id"],
        {
            name: "idx_reports_reporter"
        }
    );

    await queryInterface.addIndex(
        "reports",
        ["entity_type", "entity_id"],
        {
            name: "idx_reports_entity"
        }
    );

    await queryInterface.addIndex(
        "reports",
        ["status"],
        {
            name: "idx_reports_status"
        }
    );
}

export async function down(queryInterface) {

    await queryInterface.dropTable("reports");

    await queryInterface.sequelize.query(
        "DROP TYPE IF EXISTS enum_reports_status;"
    );
}
