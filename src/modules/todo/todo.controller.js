import asyncHandler from "#utils/asyncHandler.js";
import { sendResponse } from "#utils/sendResponse.js";
import * as todoService from "./todo.service.js";

export const createTodo = asyncHandler(async (req, res) => {
    const todo = await todoService.createTodo(req.user.id, req.validated.body);

    sendResponse(res, {
        statusCode: 201,
        message: "Todo created successfully",
        data: todo
    });
});

export const getTodos = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const todos = await todoService.getTodos(userId, req.query);

    sendResponse(res, {
        statusCode: 200,
        message: "Todos fetched successfully",
        data: todos.data,
        meta: todos.meta
    });
});

export const getTodoById = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const todoId = req.params.todoId;

    const todo = await todoService.getTodoById(userId, todoId);

    sendResponse(res, {
        statusCode: 200,
        message: "Todo fetched successfully",
        data: todo
    });

});

export const updateTodo = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const todoId = req.params.todoId;

    const todo = await todoService.updateTodo(todoId, userId, req.validated.body);

    sendResponse(res, {
        statusCode: 200,
        message: "Todo updated successfully",
        data: todo
    });
});

export const deleteTodo = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const todoId = req.params.todoId;

    const todo = await todoService.deleteTodo(todoId, userId);

    sendResponse(res, {
        statusCode: 200,
        message: "Todo deleted successfully",
        data: todo
    });
});

export const bulkDeleteTodos = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const { ids } = req.body;

    await todoService.bulkDeleteTodos(userId, ids);

    sendResponse(res, {
        statusCode: 200,
        message: "Todos deleted successfully",
    });
});


export const archiveTodo = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const todoId = req.params.todoId;

    const {
        todo,
        archivedChildrenCount,
    } = await todoService.archiveTodo(todoId, userId);

    const message =
        archivedChildrenCount > 0
            ? `Todo archived successfully. ${archivedChildrenCount} subtodo${archivedChildrenCount > 1 ? "s were" : " was"} also archived.`
            : "Todo archived successfully.";

    sendResponse(res, {
        statusCode: 200,
        message,
        data: todo,
    });

});