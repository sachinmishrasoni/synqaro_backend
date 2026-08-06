import AppError from "#utils/AppError.js";
import { getPagination, getPaginationMeta } from "#utils/pagination.utils.js";
import { Op } from "sequelize";
import Todo from "./todo.model.js";
import pickFields from "#utils/pickFields.js";
import sequelize from "#config/database.js";

export const createTodo = async (userId, payload) => {
    const { parentId, title, description, priority, status, dueDate } = payload || {};

    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
        throw new AppError("Title is required", 400);
    }

    const existingTodo = await Todo.findOne({
        where: {
            userId,
            parentId: parentId ?? null,
            title: normalizedTitle,
            archivedAt: null,
        }
    });

    if (existingTodo) {
        throw new AppError("Todo with the same title already exists", 409);
    }

    let parentTodo = null;
    if (parentId) {
        parentTodo = await Todo.findOne({
            where: {
                id: parentId,
                userId
            }
        });

        if (!parentTodo) {
            throw new AppError("Parent todo not found", 404);
        }

        if (parentTodo.parentId) {
            throw new AppError("Nested todo is not allowed", 400);
        }
    }

    const todo = await Todo.create({
        userId,
        parentId,
        title: normalizedTitle,
        description,
        priority,
        status,
        dueDate
    });

    return todo;
};

export const getTodos = async (userId, query) => {

    const { page, limit, offset } = getPagination(query);
    const { search, status, priority, dueDate, archived, parentId } = query;

    const where = { userId };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (dueDate) where.dueDate = dueDate;
    if (parentId !== undefined) where.parentId = parentId;
    if (search) {
        where[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ]
    }

    if (archived) {
        where.archivedAt = { [Op.not]: null };
    } else {
        where.archivedAt = null;
    }

    // console.log("where", where);

    const todos = await Todo.findAndCountAll({
        where,
        limit,
        offset,
        attributes: {
            exclude: ["userId", "deletedAt"],
        },
        order: [
            ["sortOrder", "ASC"],
            ["createdAt", "DESC"],
        ],
        include: [
            {
                model: Todo,
                as: "subTodos",
                attributes: {
                    exclude: ["userId", "deletedAt"],
                }
            }
        ]
    });

    return {
        meta: getPaginationMeta(todos.count, page, limit),
        data: todos.rows
    };
};

export const getTodoById = async (userId, todoId) => {
    const todo = await Todo.findOne({
        where: {
            id: todoId,
            userId
        },
        include: [
            {
                model: Todo,
                as: "subTodos",
                attributes: {
                    exclude: ["userId", "deletedAt"],
                }
            }
        ],
        attributes: {
            exclude: ["userId", "deletedAt"],
        }
    });

    if (!todo) {
        throw new AppError("Todo not found", 404);
    }

    return todo;
};

export const updateTodo = async (todoId, userId, payload) => {
    const { parentId } = payload;

    const todo = await Todo.findOne({
        where: {
            id: todoId,
            userId
        }
    });

    if (!todo) {
        throw new AppError("Todo not found", 404);
    }

    if (parentId) {
        if (Number(parentId) === Number(todoId)) {
            throw new AppError("Nested todo is not allowed", 400);
        }

        const parentTodo = await Todo.findOne({
            where: {
                id: parentId,
                userId
            }
        });
        if (!parentTodo) {
            throw new AppError("Parent todo not found", 404);
        }
    }

    const updateData = pickFields(
        payload,
        [
            "parentId",
            "title",
            "description",
            "priority",
            "status",
            "dueDate",
            "completedAt",
            "archivedAt",
            "sortOrder",
        ],
        {
            title: (value) => value.trim(),
        }
    );

    if (Object.keys(updateData).length === 0) {
        throw new AppError("No valid fields provided", 400);
    }

    await todo.update(updateData);

    return todo;

};

export const deleteTodo = async (todoId, userId) => {
    const transaction = await sequelize.transaction();

    try {

        const todo = await Todo.findOne({
            where: {
                id: todoId,
                userId,
            },
            transaction,
        });

        if (!todo) {
            throw new AppError("Todo not found", 404);
        }

        // Delete all direct subtodos
        await Todo.destroy({
            where: {
                parentId: todoId,
                userId,
            },
            transaction,
        });

        // Delete parent todo
        await todo.destroy({
            transaction,
        });

        await transaction.commit();

        return {
            id: todoId
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const bulkDeleteTodos = async (userId, ids) => {

    if (!Array.isArray(ids) || ids.length === 0) {
        throw new AppError("Please provide todo ids.", 400);
    }

    return sequelize.transaction(async (transaction) => {

        // Verify all todos belong to the user
        const todos = await Todo.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
                userId,
            },
            attributes: ["id"],
            transaction,
        });

        if (todos.length !== ids.length) {
            throw new AppError(
                "One or more todos not found.",
                404
            );
        }

        // Delete direct child todos
        await Todo.destroy({
            where: {
                parentId: {
                    [Op.in]: ids,
                },
                userId,
            },
            transaction,
        });

        // Delete selected todos
        await Todo.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
                userId,
            },
            transaction,
        });

        return {
            ids
        };
    });
};

export const archiveTodo = async () => {

};
