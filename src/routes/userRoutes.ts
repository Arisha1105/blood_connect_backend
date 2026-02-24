import { Router } from "express";
import { updateUserProfile } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.put("/profile", authMiddleware, updateUserProfile);

export default router;
