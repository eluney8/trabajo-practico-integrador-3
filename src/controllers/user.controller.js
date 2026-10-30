import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { EventModel } from "../models/event.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ deletedAt: null })
      .select("-password")
      .populate("events");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "error al obtener los usuarios",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const user = await UserModel.findOne({ _id: id, deletedAt: null })
      .select("-password")
      .populate("events");
    if (!user) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "error al obtener el usuario",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const { profile, ...data } = matchedData(req, { locations: ["body"] });
    const changes = { ...data };
    if (profile) {
      for (const field in profile) {
        changes[`profile.${field}`] = profile[field];
      }
    }
    if (Object.keys(changes).length === 0) {
      return res
        .status(400)
        .json({ message: "no se enviaron datos para actualizar" });
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: changes },
      { new: true, runValidators: true },
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    return res
      .status(200)
      .json({ message: "usuario actualizado correctamente", user: updatedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "el username o email ya esta en uso" });
    }
    return res.status(500).json({
      message: "error al actualizar el usuario",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const deletedUser = await UserModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    );
    if (!deletedUser) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    await EventModel.deleteMany({ organizer: id });
    return res
      .status(200)
      .json({ message: "usuario y sus eventos eliminados correctamente" });
  } catch (error) {
    return res.status(500).json({
      message: "error al eliminar el usuario",
      error: error.message,
    });
  }
};
