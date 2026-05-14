import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { login, register, remove, update, users } from "./user.controller.js";

export const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/users", requireAuth, requireAdmin, users);
userRouter.put("/users/:id", requireAuth, requireAdmin, update);
userRouter.delete("/users/:id", requireAuth, requireAdmin, remove);
