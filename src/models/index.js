import Profile from "#modules/profile/profile.model.js";
import User from "#modules/user/user.model.js";
import AuthToken from "#modules/auth/authToken.model.js";
import OtpCode from "#modules/auth/otpCode.model.js";

/* User <--> Profile(1:1) */
User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

/* User <--> AuthToken(1:N) */
User.hasMany(AuthToken, { foreignKey: "userId", onDelete: "CASCADE" });
AuthToken.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

/* Profile <--> OTP (1:N) */
User.hasMany(OtpCode, { foreignKey: "userId", onDelete: "CASCADE" });
OtpCode.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

export { User, Profile, AuthToken, OtpCode };
