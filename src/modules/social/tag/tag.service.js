import Tag from "./tag.model.js";

// Create (if not exist) + return tag instances
export const getOrCreateTags = async (tags = [], transaction) => {
    if (!tags.length) return [];

    const uniqueTags = [...new Set(tags)];

    const existingTags = await Tag.findAll({
        where: { name: uniqueTags },
        transaction
    });

    const existingNames = existingTags.map(t => t.name);

    const newTags = uniqueTags
        .filter(t => !existingNames.includes(t))
        .map(name => ({ name }));

    let createdTags = [];
    if (newTags.length > 0) {
        createdTags = await Tag.bulkCreate(newTags, { transaction });
    }

    return [...existingTags, ...createdTags];
};
