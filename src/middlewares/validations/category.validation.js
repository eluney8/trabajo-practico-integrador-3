import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import { CategoryModel } from "../../models/category.model.js";
import { mongoIdValidation } from "./user.validation.js";

export const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("el nombre es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("el nombre debe tener entre 2 y 30 caracteres")
    .custom(async (name) => {
      const category = await CategoryModel.findOne({ name });
      if (category) throw new Error("ya existe una categoria con ese nombre");
      return true;
    }),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("la descripcion no puede superar los 200 caracteres"),
];

export const updateCategoryValidation = [
  ...mongoIdValidation,
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("el nombre debe tener entre 2 y 30 caracteres")
    .custom(async (name, { req }) => {
      if (!isValidObjectId(req.params.id)) return true;
      const category = await CategoryModel.findOne({
        name,
        _id: { $ne: req.params.id },
      });
      if (category) throw new Error("ya existe una categoria con ese nombre");
      return true;
    }),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("la descripcion no puede superar los 200 caracteres"),
];
