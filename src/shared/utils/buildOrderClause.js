/**
 * Builds a Sequelize order clause from request query parameters.
 *
 * Only fields included in `sortableFields` are allowed to be used
 * for sorting.
 *
 * @param {Object} options
 * @param {Object} options.query - Request query object.
 * @param {string[]} options.sortableFields - Fields allowed for sorting.
 * @param {Array[]} options.defaultSort - Default Sequelize order clause.
 *
 * @returns {Array[]} Sequelize order clause.
 *
 * @example
 * const order = buildOrderClause({
 *     query: req.query,
 *     sortableFields: [
 *         "title",
 *         "priority",
 *         "dueDate",
 *         "createdAt",
 *     ],
 *     defaultSort: [
 *         ["createdAt", "DESC"],
 *     ],
 * });
 *
 * // GET /todos?sortBy=priority&sortOrder=ASC
 *
 * // Result:
 * [
 *     ["priority", "ASC"]
 * ]
 */
const buildOrderClause = ({
    query = {},
    sortableFields = [],
    defaultSort = [],
}) => {

    const { sortBy, sortOrder } = query;

    // No sorting requested
    if (!sortBy) {
        return defaultSort;
    }

    // Prevent arbitrary column sorting
    if (!sortableFields.includes(sortBy)) {
        return defaultSort;
    }

    const order =
        String(sortOrder).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

    return [
        [sortBy, order],
    ];
};

export default buildOrderClause;
