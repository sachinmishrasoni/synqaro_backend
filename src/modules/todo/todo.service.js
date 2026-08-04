import AppError from "#utils/AppError.js";
import { getPagination, getPaginationMeta } from "#utils/pagination.utils.js";
import { Op } from "sequelize";
import Todo from "./todo.model.js";

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
    }else {
        where.archivedAt = null;
    }

    console.log("where", where);

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
    });

    return {
        meta: getPaginationMeta(todos.count, page, limit),
        data: todos.rows
    };
};

export const getTodo = async () => {

};

export const updateTodo = async () => {

};

export const deleteTodo = async () => {

};

export const archiveTodo = async () => {

};
