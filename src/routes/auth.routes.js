import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validator.js";
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
} from "../middlewares/validations/auth.validation.js";

export const authRouter = Router();

authRouter.post("/auth/register", registerValidation, validator, register);
authRouter.post("/auth/login", loginValidation, validator, login);
authRouter.get("/auth/profile", authMiddleware, getProfile);
authRouter.put(
  "/auth/profile",
  authMiddleware,
  updateProfileValidation,
  validator,
  updateProfile,
);
authRouter.post("/auth/logout", authMiddleware, logout);
