import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import { EventModel } from "../../models/event.model.js";
import { CategoryModel } from "../../models/category.model.js";
import { mongoIdValidation } from "./user.validation.js";

const categoriesExist = async (categories) => {
  const count = await CategoryModel.countDocuments({
    _id: { $in: categories },
  });
  if (count !== categories.length) {
    throw new Error("alguna de las categorias no existe");
  }
  return true;
};

export const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("el titulo es obligatorio")
    .isLength({ min: 3, max: 150 })
    .withMessage("el titulo debe tener entre 3 y 150 caracteres")
    .custom(async (title) => {
      const event = await EventModel.findOne({ title });
      if (event) throw new Error("ya existe un evento con ese titulo");
      return true;
    }),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("la descripcion es obligatoria")
    .isLength({ min: 20 })
    .withMessage("la descripcion debe tener al menos 20 caracteres"),
  body("startDate")
    .notEmpty()
    .withMessage("la fecha de inicio es obligatoria")
    .isISO8601()
    .withMessage("la fecha de inicio no es valida"),
  body("endDate")
    .notEmpty()
    .withMessage("la fecha de fin es obligatoria")
    .isISO8601()
    .withMessage("la fecha de fin no es valida")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("la fecha de fin debe ser posterior a la de inicio");
      }
      return true;
    }),
  body("capacity")
    .notEmpty()
    .withMessage("la capacidad es obligatoria")
    .isInt({ min: 1 })
    .withMessage("la capacidad debe ser un numero entero mayor o igual a 1")
    .toInt(),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("el precio debe ser un numero mayor o igual a 0")
    .toFloat(),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("el estado debe ser scheduled, cancelled o finished"),
  body("location.venue")
    .trim()
    .notEmpty()
    .withMessage("el lugar es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("el lugar debe tener entre 3 y 100 caracteres"),
  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("la direccion es obligatoria")
    .isLength({ min: 5, max: 150 })
    .withMessage("la direccion debe tener entre 5 y 150 caracteres"),
  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("la ciudad es obligatoria")
    .isLength({ min: 2, max: 50 })
    .withMessage("la ciudad debe tener entre 2 y 50 caracteres"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("las categorias deben enviarse en un array")
    .customSanitizer((categories) => [...new Set(categories)]),
  body("categories.*")
    .isMongoId()
    .withMessage("cada categoria debe ser un id valido"),
  body("categories").optional().custom(categoriesExist),
];

const getSavedDates = async (req) => {
  if (!isValidObjectId(req.params.id)) return null;
  return await EventModel.findById(req.params.id).select("startDate endDate");
};

export const updateEventValidation = [
  ...mongoIdValidation,
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("el titulo debe tener entre 3 y 150 caracteres")
    .custom(async (title, { req }) => {
      if (!isValidObjectId(req.params.id)) return true;
      const event = await EventModel.findOne({
        title,
        _id: { $ne: req.params.id },
      });
      if (event) throw new Error("ya existe un evento con ese titulo");
      return true;
    }),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage("la descripcion debe tener al menos 20 caracteres"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("la fecha de inicio no es valida")
    .custom(async (startDate, { req }) => {
      if (req.body.endDate) return true;
      const saved = await getSavedDates(req);
      if (saved && new Date(startDate) >= saved.endDate) {
        throw new Error("la fecha de inicio debe ser anterior a la de fin");
      }
      return true;
    }),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("la fecha de fin no es valida")
    .custom(async (endDate, { req }) => {
      let startDate = req.body.startDate;
      if (!startDate) {
        const saved = await getSavedDates(req);
        if (!saved) return true;
        startDate = saved.startDate;
      }
      if (new Date(endDate) <= new Date(startDate)) {
        throw new Error("la fecha de fin debe ser posterior a la de inicio");
      }
      return true;
    }),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("la capacidad debe ser un numero entero mayor o igual a 1")
    .toInt(),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("el precio debe ser un numero mayor o igual a 0")
    .toFloat(),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("el estado debe ser scheduled, cancelled o finished"),
  body("location.venue")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("el lugar debe tener entre 3 y 100 caracteres"),
  body("location.address")
    .optional()
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage("la direccion debe tener entre 5 y 150 caracteres"),
  body("location.city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("la ciudad debe tener entre 2 y 50 caracteres"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("las categorias deben enviarse en un array")
    .customSanitizer((categories) => [...new Set(categories)]),
  body("categories.*")
    .isMongoId()
    .withMessage("cada categoria debe ser un id valido"),
  body("categories").optional().custom(categoriesExist),
];
