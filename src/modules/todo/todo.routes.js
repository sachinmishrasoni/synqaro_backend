import { Router } from "express";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.js";
import { createTodo, getTodos } from "./todo.controller.js";
import { createTodoSchema } from "./todo.schema.js";

const todoRoutes = Router();

todoRoutes.post("/", authenticate, validate(createTodoSchema), createTodo);
todoRoutes.get("/", authenticate, getTodos);

export default todoRoutes;
