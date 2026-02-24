"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
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
exports.roleMiddleware = roleMiddleware;
