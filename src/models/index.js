import Profile from "#modules/profile/profile.model.js";
import User from "#modules/user/user.model.js";
import AuthToken from "#modules/auth/authToken.model.js";
import OtpCode from "#modules/auth/otpCode.model.js";
import Post from "#modules/social/post/post.model.js";
import Tag from "#modules/social/tag/tag.model.js";
import PostTag from "#modules/social/tag/postTag.model.js";
import Comment from "#modules/social/comment/comment.model.js";
import Reaction from "#modules/social/reaction/reaction.model.js";
import Follow from "#modules/social/follow/follow.model.js";
import Notification from "#modules/notification/notification.model.js";
import Bookmark from "#modules/social/bookmark/bookmark.model.js";
import Block from "#modules/block/block.model.js";

/* User <--> Profile(1:1) */
User.hasOne(Profile, { as: "profile", foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { as: "user", foreignKey: "userId", onDelete: "CASCADE" });

/* User <--> AuthToken(1:N) */
User.hasMany(AuthToken, { as: "authTokens", foreignKey: "userId", onDelete: "CASCADE" });
AuthToken.belongsTo(User, { as: "user", foreignKey: "userId", onDelete: "CASCADE" });

/* Profile <--> OTP (1:N) */
User.hasMany(OtpCode, { as: "otpCodes", foreignKey: "userId", onDelete: "CASCADE" });
OtpCode.belongsTo(User, { as: "user", foreignKey: "userId", onDelete: "CASCADE" });

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

/* Post <--> Comment (1:N) */
Post.hasMany(Comment, {
    foreignKey: "postId",
    onDelete: "CASCADE",
    as: "comments"
});

Comment.belongsTo(Post, {
    foreignKey: "postId",
    onDelete: "CASCADE",
    as: "post"
});

/* User <--> Comment (1:N) */
User.hasMany(Comment, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "comments"
});

Comment.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "user"
});

/* Comment <--> Comment (1:N) */
Comment.belongsTo(Comment, {
    as: "parent",
    foreignKey: "parentId",
    onDelete: "CASCADE"
});

Comment.hasMany(Comment, {
    as: "replies",
    foreignKey: "parentId",
    onDelete: "CASCADE"
});

/* User <--> Reaction (1:N) */
User.hasMany(Reaction, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "reactions"
});

Reaction.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "user"
});


User.belongsToMany(User, {
    through: Follow,
    as: "followers",
    foreignKey: "followingId",
    otherKey: "followerId"
});

User.belongsToMany(User, {
    through: Follow,
    as: "following",
    foreignKey: "followerId",
    otherKey: "followingId"
});

Follow.belongsTo(User, {
    foreignKey: "followerId",
    as: "follower"
});

Follow.belongsTo(User, {
    foreignKey: "followingId",
    as: "following"
});


/* Sender */
User.hasMany(Notification, {
    foreignKey: "senderId",
    as: "sentNotifications"
});

Notification.belongsTo(User, {
    foreignKey: "senderId",
    as: "sender"
});

/* Receiver */
User.hasMany(Notification, {
    foreignKey: "receiverId",
    as: "receivedNotifications"
});

Notification.belongsTo(User, {
    foreignKey: "receiverId",
    as: "receiver"
});

/* User <--> Bookmark (1:N) */
User.hasMany(Bookmark, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "bookmarks"
});

Bookmark.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "user"
});

/* User <--> Block (Blocker) */
User.hasMany(Block, {
    foreignKey: "blockerId",
    onDelete: "CASCADE",
    as: "blockedUsers"
});

Block.belongsTo(User, {
    foreignKey: "blockerId",
    onDelete: "CASCADE",
    as: "blocker"
});

/* User <--> Block (Blocked) */
User.hasMany(Block, {
    foreignKey: "blockedId",
    onDelete: "CASCADE",
    as: "blockedByUsers"
});

Block.belongsTo(User, {
    foreignKey: "blockedId",
    onDelete: "CASCADE",
    as: "blocked"
});

export {
    User, Profile, AuthToken, OtpCode, Post, Tag, PostTag,
    Comment, Reaction, Follow, Notification, Bookmark, Block
};
