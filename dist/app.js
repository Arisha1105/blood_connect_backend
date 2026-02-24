"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10kb" }));
app.use("/auth", authRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/events", eventRoutes_1.default);
console.log("REGISTERED ROUTES:");
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    }
    else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`${Object.keys(handler.route.methods)} ${handler.route.path}`);
            }
        });
    }
});
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});
const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
};
app.use(errorHandler);
exports.default = app;
