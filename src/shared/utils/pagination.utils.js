export const getPagination = (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    return {
        page,
        limit,
        offset: (page - 1) * limit
    };
};

export const getPaginationMeta = (
    total,
    page,
    limit
) => {
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};
