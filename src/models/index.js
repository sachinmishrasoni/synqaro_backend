import Profile from "#modules/profile/profile.model.js";
import User from "#modules/user/user.model.js";
import AuthToken from "#modules/auth/authToken.model.js";
import OtpCode from "#modules/auth/otpCode.model.js";
import Post from "#modules/social/post/post.model.js";
import Tag from "#modules/social/tag/tag.model.js";
import PostTag from "#modules/social/tag/postTag.model.js";

/* User <--> Profile(1:1) */
User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

/* User <--> AuthToken(1:N) */
User.hasMany(AuthToken, { foreignKey: "userId", onDelete: "CASCADE" });
AuthToken.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

/* Profile <--> OTP (1:N) */
User.hasMany(OtpCode, { foreignKey: "userId", onDelete: "CASCADE" });
OtpCode.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

/* User <--> Post (1:N) */
User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", as: "user" });

/* Post <--> Tag (M:N) */
// Post.belongsToMany(Tag, { through: "post_tags", foreignKey: "postId", as: "tags", onDelete: "CASCADE" });
// Tag.belongsToMany(Post, { through: "post_tags", foreignKey: "tagId", as: "posts", onDelete: "CASCADE" });
Post.belongsToMany(Tag, {
    through: PostTag,
    foreignKey: "postId",
    otherKey: "tagId",
    as: "tags",
    onDelete: "CASCADE"
});

Tag.belongsToMany(Post, {
    through: PostTag,
    foreignKey: "tagId",
    otherKey: "postId",
    as: "posts",
    onDelete: "CASCADE"
});

export { User, Profile, AuthToken, OtpCode, Post, Tag, PostTag };
