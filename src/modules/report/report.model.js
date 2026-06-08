import { DataTypes } from "sequelize";
import sequelize from "#config/database.js";
import { REPORT_STATUS } from "#constants/report.constants.js";

const Report = sequelize.define("reports", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },

    entityType: {
        type: DataTypes.STRING,
        allowNull: false
    },

    entityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM(
            ...Object.values(REPORT_STATUS)
        ),
        allowNull: false,
        defaultValue: REPORT_STATUS.PENDING
    },

    reviewedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id"
        }
    },

    reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    tableName: "reports",
    timestamps: true,
    underscored: true,

    indexes: [
        {
            fields: ["reporterId"]
        },
        {
            fields: ["entityType", "entityId"]
        },
        {
            fields: ["status"]
        }
    ]
});

export default Report;
