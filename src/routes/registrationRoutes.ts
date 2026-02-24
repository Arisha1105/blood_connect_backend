import { Router } from "express";
import {
  cancelRegistration,
  createRegistration,
  getAllRegistrations,
  getMyRegistrations,
} from "../controllers/registrationController";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createRegistration);
router.get("/my", authMiddleware, getMyRegistrations);
router.delete("/:id", authMiddleware, cancelRegistration);
router.get("/", authMiddleware, adminMiddleware, getAllRegistrations);

export default router;
