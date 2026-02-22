import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authorization token is required" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded.userId || typeof decoded.userId !== "string") {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
