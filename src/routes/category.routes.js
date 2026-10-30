import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validator } from "../middlewares/validator.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../middlewares/validations/category.validation.js";
import { mongoIdValidation } from "../middlewares/validations/user.validation.js";

export const categoryRouter = Router();

categoryRouter.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  createCategoryValidation,
  validator,
  createCategory,
);
categoryRouter.get("/categories", authMiddleware, getAllCategories);
categoryRouter.get(
  "/categories/:id",
  authMiddleware,
  mongoIdValidation,
  validator,
  getCategoryById,
);
categoryRouter.put(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  updateCategoryValidation,
  validator,
  updateCategory,
);
categoryRouter.delete(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  mongoIdValidation,
  validator,
  deleteCategory,
);
