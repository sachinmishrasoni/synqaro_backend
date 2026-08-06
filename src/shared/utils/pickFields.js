/**
 * Creates a new object containing only the specified fields from the source object.
 * Optionally applies field-specific transformers before returning the result.
 *
 * @template T
 * @param {T} data - The source object.
 * @param {Array<keyof T>} fields - List of fields to include.
 * @param {Partial<Record<keyof T, (value: any) => any>>} [transformers={}]
 * Optional transformers for specific fields.
 * @returns {Partial<T>} A new object containing only the selected fields.
 *
 * @example
 * const payload = {
 *   title: "  Learn Backend  ",
 *   description: "Node.js & Express",
 *   priority: "high",
 *   status: "pending",
 *   userId: 1,
 *   createdAt: new Date(),
 * };
 *
 * const updateData = pickFields(
 *   payload,
 *   ["title", "description", "priority"],
 *   {
 *     title: (value) => value.trim(),
 *   }
 * );
 *
 * console.log(updateData);
 *
 * // Output:
 * // {
 * //   title: "Learn Backend",
 * //   description: "Node.js & Express",
 * //   priority: "high"
 * // }
 */
const pickFields = (data = {}, fields = [], transformers = {}) => {
    const result = {};

    for (const key of fields) {
        if (Object.hasOwn(data, key) && data[key] !== undefined) {
            result[key] = transformers[key]
                ? transformers[key](data[key])
                : data[key];
        }
    }

    return result;
};

export default pickFields;
