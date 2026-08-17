import { Op } from "sequelize";

/**
 * Builds a Sequelize where clause with support for:
 * - Exact filters
 * - Search
 * - Custom conditions
 *
 * @param {Object} options
 * @param {Object} options.baseWhere - Base conditions.
 * @param {Object} options.query - Request query.
 * @param {string[]} [options.filters=[]] - Allowed filter fields.
 * @param {Object} [options.search] - Search configuration.
 * @param {string} options.search.keyword - Search keyword.
 * @param {string[]} options.search.fields - Searchable fields.
 * @param {Function} [options.custom] - Callback for custom conditions.
 *
 * @returns {Object}
 *
 * @example
 * const where = buildWhereClause({
 *   baseWhere: { userId },
 *   query,
 *   filters: ["status", "priority"],
 *   search: {
 *      keyword: query.search,
 *      fields: ["title", "description"]
 *   },
 *   custom: (where) => {
 *      where.archivedAt = null;
 *   }
 * });
 */
const buildWhereClause = ({
    baseWhere = {},
    query = {},
    filters = [],
    search,
    custom,
}) => {

    const where = { ...baseWhere };

    // Exact Filters
    for (const field of filters) {
        if (query[field] !== undefined) {
            where[field] = query[field];
        }
    }

    // Search
    if (search?.keyword && search.fields?.length) {
        where[Op.or] = search.fields.map(field => ({
            [field]: {
                [Op.like]: `%${search.keyword}%`,
            },
        }));
    }

    // Custom Conditions
    if (typeof custom === "function") {
        custom(where);
    }

    return where;
};

export default buildWhereClause;
