import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";
import { EventModel } from "../models/event.model.js";

export const createCategory = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const category = await CategoryModel.create(data);
    return res
      .status(201)
      .json({ message: "categoria creada correctamente", category });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "ya existe una categoria con ese nombre" });
    }
    return res.status(500).json({
      message: "error al crear la categoria",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      message: "error al obtener las categorias",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const category = await CategoryModel.findById(id).populate(
      "events",
      "title startDate endDate status",
    );
    if (!category) {
      return res.status(404).json({ message: "categoria no encontrada" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({
      message: "error al obtener la categoria",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const data = matchedData(req, { locations: ["body"] });
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ message: "no se enviaron datos para actualizar" });
    }
    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ message: "categoria no encontrada" });
    }
    return res.status(200).json({
      message: "categoria actualizada correctamente",
      category: updatedCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "ya existe una categoria con ese nombre" });
    }
    return res.status(500).json({
      message: "error al actualizar la categoria",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "categoria no encontrada" });
    }
    await EventModel.updateMany({ categories: id }, { $pull: { categories: id } });
    return res
      .status(200)
      .json({ message: "categoria eliminada y quitada de sus eventos" });
  } catch (error) {
    return res.status(500).json({
      message: "error al eliminar la categoria",
      error: error.message,
    });
  }
};
