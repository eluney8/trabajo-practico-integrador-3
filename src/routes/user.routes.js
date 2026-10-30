import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validator } from "../middlewares/validator.js";
import {
  mongoIdValidation,
  updateUserValidation,
} from "../middlewares/validations/user.validation.js";

export const userRouter = Router();

userRouter.get("/users", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  mongoIdValidation,
  validator,
  getUserById,
);
userRouter.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  updateUserValidation,
  validator,
  updateUser,
);
userRouter.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  mongoIdValidation,
  validator,
  deleteUser,
);
