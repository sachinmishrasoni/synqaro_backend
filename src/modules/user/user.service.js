import User from "#modules/user/user.model.js";
import Profile from "#modules/profile/profile.model.js";
import Post from "#modules/social/post/post.model.js";
import Follow from "#modules/social/follow/follow.model.js";
import AppError from "#utils/AppError.js";

export const getUserProfile = async (
    currentUserId,
    profileUserId
) => {

    const user = await User.findByPk(profileUserId, {
        attributes: ["id", "firstName", "lastName", "userName"],
        include: [
            {
                model: Profile,
                as: "profile",
                attributes: [
                    "bio",
                    "avatar",
                    "banner"
                ],
            }
        ]
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const [
        followersCount,
        followingCount,
        postsCount,
        followRecord
    ] = await Promise.all([
        Follow.count({
            where: {
                followingId: profileUserId
            }
        }),

        Follow.count({
            where: {
                followerId: profileUserId
            }
        }),

        Post.count({
            where: {
                userId: profileUserId
            }
        }),

        Follow.findOne({
            where: {
                followerId: currentUserId,
                followingId: profileUserId
            }
        })
    ]);

    return {
        ...user.toJSON(),

        followersCount,
        followingCount,
        postsCount,

        isFollowing: !!followRecord
    };
};