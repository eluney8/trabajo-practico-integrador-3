import { matchedData } from "express-validator";
import { EventModel } from "../models/event.model.js";

const organizerFields = "username email profile.firstName profile.lastName";
const categoryFields = "name description";

export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const newEvent = await EventModel.create({
      ...data,
      organizer: req.user.id,
    });
    const event = await EventModel.findById(newEvent._id)
      .populate("organizer", organizerFields)
      .populate("categories", categoryFields);
    return res
      .status(201)
      .json({ message: "evento creado correctamente", event });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "ya existe un evento con ese titulo" });
    }
    return res.status(500).json({
      message: "error al crear el evento",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find()
      .populate("organizer", organizerFields)
      .populate("categories", categoryFields);
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({
      message: "error al obtener los eventos",
      error: error.message,
    });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await EventModel.find({ organizer: req.user.id }).populate(
      "categories",
      categoryFields,
    );
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({
      message: "error al obtener tus eventos",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const event = await EventModel.findById(id)
      .populate("organizer", organizerFields)
      .populate("categories", categoryFields);
    if (!event) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({
      message: "error al obtener el evento",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const { location, ...data } = matchedData(req, { locations: ["body"] });
    const changes = { ...data };
    if (location) {
      for (const field in location) {
        changes[`location.${field}`] = location[field];
      }
    }
    if (Object.keys(changes).length === 0) {
      return res
        .status(400)
        .json({ message: "no se enviaron datos para actualizar" });
    }
    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      { $set: changes },
      { new: true, runValidators: true },
    )
      .populate("organizer", organizerFields)
      .populate("categories", categoryFields);
    if (!updatedEvent) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    return res
      .status(200)
      .json({ message: "evento actualizado correctamente", event: updatedEvent });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "ya existe un evento con ese titulo" });
    }
    return res.status(500).json({
      message: "error al actualizar el evento",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const deletedEvent = await EventModel.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    return res.status(200).json({ message: "evento eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({
      message: "error al eliminar el evento",
      error: error.message,
    });
  }
};
