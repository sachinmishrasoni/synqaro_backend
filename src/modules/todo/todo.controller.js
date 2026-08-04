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
    const todos = await todoService.getTodos(req.user.id, req.query);

    sendResponse(res, {
        statusCode: 200,
        message: "Todos fetched successfully",
        data: todos.data,
        meta: todos.meta
    });
});
