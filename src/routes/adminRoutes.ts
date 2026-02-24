import { Router } from "express";
import {
  adminLogin,
  deleteUserById,
  getAdminProfile,
  getAllUsers,
  getDashboardStats,
} from "../controllers/adminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.post("/login", adminLogin);
router.get("/profile", authMiddleware, adminMiddleware, getAdminProfile);
router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUserById);

export default router;
