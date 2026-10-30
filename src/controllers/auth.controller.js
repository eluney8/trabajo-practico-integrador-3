import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";

export const register = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const hashedPassword = await hashPassword(data.password);
    const newUser = await UserModel.create({
      ...data,
      password: hashedPassword,
    });
    const user = newUser.toObject();
    delete user.password;
    return res
      .status(201)
      .json({ message: "usuario registrado correctamente", user });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "el username o email ya esta registrado" });
    }
    return res.status(500).json({
      message: "error al registrar el usuario",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req, { locations: ["body"] });
    const user = await UserModel.findOne({ email, deletedAt: null });
    if (!user) {
      return res.status(401).json({ message: "credenciales invalidas" });
    }
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "credenciales invalidas" });
    }
    const token = signToken({ id: user._id.toString(), role: user.role });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    });
    return res.status(200).json({ message: "login exitoso" });
  } catch (error) {
    return res.status(500).json({
      message: "error al iniciar sesion",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.user.id,
      deletedAt: null,
    })
      .select("-password")
      .populate("events");
    if (!user) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "error al obtener el perfil",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profile } = matchedData(req, { locations: ["body"] });
    if (!profile || Object.keys(profile).length === 0) {
      return res
        .status(400)
        .json({ message: "no se enviaron datos para actualizar" });
    }
    const changes = {};
    for (const field in profile) {
      changes[`profile.${field}`] = profile[field];
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.user.id, deletedAt: null },
      { $set: changes },
      { new: true, runValidators: true },
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    return res
      .status(200)
      .json({ message: "perfil actualizado correctamente", user: updatedUser });
  } catch (error) {
    return res.status(500).json({
      message: "error al actualizar el perfil",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "sesion cerrada correctamente" });
  } catch (error) {
    return res.status(500).json({
      message: "error al cerrar sesion",
      error: error.message,
    });
  }
};
