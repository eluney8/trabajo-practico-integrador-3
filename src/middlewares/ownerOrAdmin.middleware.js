import { EventModel } from "../models/event.model.js";

export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    const isOwner = event.organizer.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "no tenes permiso para modificar este evento" });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "error al verificar permisos",
      error: error.message,
    });
  }
};
