export const formatProfile = (profile) => {
    const data = profile.toJSON();

    delete data.userId;
    delete data.avatarPublicId;
    delete data.bannerPublicId;

    return data;
};