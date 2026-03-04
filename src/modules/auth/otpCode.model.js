import { DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

const OtpCode = sequelize.define("OtpCode", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        }
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("email_verification", "password_reset"),
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    attemptCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: "otp_codes",
    timestamps: true,
    underscored: true,
});

export default OtpCode;
