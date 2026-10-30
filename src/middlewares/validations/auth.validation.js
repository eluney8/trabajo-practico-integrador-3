import { body } from "express-validator";
import { UserModel } from "../../models/user.model.js";

const onlyLetters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("el username es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("el username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("el username solo puede tener letras y numeros")
    .custom(async (username) => {
      const user = await UserModel.findOne({ username });
      if (user) throw new Error("el username ya esta en uso");
      return true;
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("el email es obligatorio")
    .isEmail()
    .withMessage("el email no tiene un formato valido")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user) throw new Error("el email ya esta registrado");
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("la contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("la contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "la contraseña debe tener al menos una mayuscula, una minuscula y un numero",
    ),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("el rol debe ser user o admin"),
  body("profile.firstName")
    .trim()
    .notEmpty()
    .withMessage("el nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("el nombre debe tener entre 2 y 50 caracteres")
    .matches(onlyLetters)
    .withMessage("el nombre solo puede tener letras"),
  body("profile.lastName")
    .trim()
    .notEmpty()
    .withMessage("el apellido es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("el apellido debe tener entre 2 y 50 caracteres")
    .matches(onlyLetters)
    .withMessage("el apellido solo puede tener letras"),
  body("profile.birthDate")
    .optional()
    .isISO8601()
    .withMessage("la fecha de nacimiento no es valida")
    .custom((birthDate) => {
      if (new Date(birthDate) > new Date()) {
        throw new Error("la fecha de nacimiento no puede ser futura");
      }
      return true;
    }),
  body("profile.phone")
    .optional()
    .trim()
    .matches(/^\d{8,15}$/)
    .withMessage("el telefono debe tener solo numeros, entre 8 y 15 digitos"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("el email es obligatorio")
    .isEmail()
    .withMessage("el email no tiene un formato valido")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("la contraseña es obligatoria"),
];

export const updateProfileValidation = [
  body("profile.firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("el nombre debe tener entre 2 y 50 caracteres")
    .matches(onlyLetters)
    .withMessage("el nombre solo puede tener letras"),
  body("profile.lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("el apellido debe tener entre 2 y 50 caracteres")
    .matches(onlyLetters)
    .withMessage("el apellido solo puede tener letras"),
  body("profile.birthDate")
    .optional()
    .isISO8601()
    .withMessage("la fecha de nacimiento no es valida")
    .custom((birthDate) => {
      if (new Date(birthDate) > new Date()) {
        throw new Error("la fecha de nacimiento no puede ser futura");
      }
      return true;
    }),
  body("profile.phone")
    .optional()
    .trim()
    .matches(/^\d{8,15}$/)
    .withMessage("el telefono debe tener solo numeros, entre 8 y 15 digitos"),
];
