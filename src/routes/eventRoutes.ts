import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "../controllers/eventController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", authMiddleware, roleMiddleware(["admin"]), createEvent);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteEvent);

export default router;
