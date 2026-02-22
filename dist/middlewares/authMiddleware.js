"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Authorization token is required" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded.userId || typeof decoded.userId !== "string") {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }
        const user = await User_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
