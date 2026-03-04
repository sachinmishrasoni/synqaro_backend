import express from "express";
import { validate } from "../../middlewares/validate.js";
import { createUserSchema } from "./user.schema.js";
import { createUser } from "./user.controller.js";

const userRoutes = express.Router();

userRoutes.post("/", validate(createUserSchema), createUser);

export default userRoutes;
