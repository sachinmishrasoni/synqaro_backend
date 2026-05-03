import { DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";
import { hashPassword } from "#utils/password.js";
import { Profile } from "#models/index.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user"
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM("active", "suspended", "banned"),
        allowNull: false,
        defaultValue: "active"
    }
}, {
    tableName: "users",
    timestamps: true,
    underscored: true,
    paranoid: true,
    defaultScope: {
        attributes: { exclude: ["password"] }
    },
    scopes: {
        withPassword: {
            attributes: { include: ["password"] }
        }
    },
    hooks: {
        // Hash password before saving
        beforeSave: async (user) => {
            if (user.changed("password")) {
                user.password = await hashPassword(user.password);
            }
        },

        // Profile will be created automatically when user is created
        afterCreate: async (user, options) => {
            await Profile.create(
                { userId: user.id },
                { transaction: options.transaction }
            );
        }
    }
});

// User.addHook("beforeSave", async (user) => {
//     if (user.changed("password")) {
//         user.password = await bcrypt.hash(user.password, 10);
//     }
// });

// User.addHook("beforeUpdate", async (user) => {
//     if (user.changed("password")) {
//         user.password = await bcrypt.hash(user.password, 10);
//     }
// });

export default User;
