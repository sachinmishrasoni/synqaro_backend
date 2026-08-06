import { Router } from "express";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.js";
import { createTodo, getTodoById, getTodos, updateTodo, deleteTodo, bulkDeleteTodos } from "./todo.controller.js";
import { bulkDeleteTodoSchema, createTodoSchema } from "./todo.schema.js";

const todoRoutes = Router();

// GET     /todos
// GET     /todos/:id
// POST    /todos
// PATCH   /todos/:id
// DELETE  /todos/:id
// DELETE  /todos          ← Bulk Delete
// PATCH   /todos/archive
// PATCH   /todos/restore
// PATCH   /todos/reorder


todoRoutes.post("/", authenticate, validate(createTodoSchema), createTodo);
todoRoutes.get("/", authenticate, getTodos);
todoRoutes.get("/:todoId", authenticate, getTodoById);
todoRoutes.put("/:todoId", authenticate, validate(createTodoSchema), updateTodo);
todoRoutes.delete("/:todoId", authenticate, deleteTodo);
todoRoutes.delete("/", authenticate, validate(bulkDeleteTodoSchema), bulkDeleteTodos);

export default todoRoutes;
