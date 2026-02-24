import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userRole = String(req.user.role).toLowerCase();

    if (!allowedRoles.map((role) => role.toLowerCase()).includes(userRole)) {
      res.status(403).json({ message: "Forbidden: insufficient permissions" });
      return;
    }

    next();
  };
};
