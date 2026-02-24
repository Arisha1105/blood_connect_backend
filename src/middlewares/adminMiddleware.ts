import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (String(req.user.role).toLowerCase() !== "admin") {
    res.status(403).json({ message: "Forbidden: admin access required" });
    return;
  }

  next();
};
