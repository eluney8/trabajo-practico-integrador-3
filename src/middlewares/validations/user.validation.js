import { body, param } from "express-validator";
import { UserModel } from "../../models/user.model.js";
import { updateProfileValidation } from "./auth.validation.js";

export const mongoIdValidation = [
  param("id").isMongoId().withMessage("el id no es valido"),
];

export const updateUserValidation = [
  ...mongoIdValidation,
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("el username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("el username solo puede tener letras y numeros")
    .custom(async (username, { req }) => {
      const user = await UserModel.findOne({
        username,
        _id: { $ne: req.params.id },
      });
      if (user) throw new Error("el username ya esta en uso");
      return true;
    }),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("el email no tiene un formato valido")
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (user) throw new Error("el email ya esta registrado");
      return true;
    }),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("el rol debe ser user o admin"),
  ...updateProfileValidation,
];
