import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";
import { validator } from "../middlewares/validator.js";
import {
  createEventValidation,
  updateEventValidation,
} from "../middlewares/validations/event.validation.js";
import { mongoIdValidation } from "../middlewares/validations/user.validation.js";

export const eventRouter = Router();

eventRouter.post(
  "/events",
  authMiddleware,
  createEventValidation,
  validator,
  createEvent,
);
eventRouter.get("/events", authMiddleware, getAllEvents);
eventRouter.get("/events/my", authMiddleware, getMyEvents);
eventRouter.get(
  "/events/:id",
  authMiddleware,
  mongoIdValidation,
  validator,
  getEventById,
);
eventRouter.put(
  "/events/:id",
  authMiddleware,
  updateEventValidation,
  validator,
  ownerOrAdminMiddleware,
  updateEvent,
);
eventRouter.delete(
  "/events/:id",
  authMiddleware,
  mongoIdValidation,
  validator,
  ownerOrAdminMiddleware,
  deleteEvent,
);
