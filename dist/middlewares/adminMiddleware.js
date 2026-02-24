"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
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
exports.adminMiddleware = adminMiddleware;
