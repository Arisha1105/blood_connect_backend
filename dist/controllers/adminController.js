"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.getAllUsers = exports.getDashboardStats = exports.getAdminProfile = exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Event_1 = __importDefault(require("../models/Event"));
const jwt_1 = require("../utils/jwt");
const sanitizeAdmin = (admin) => ({
    id: admin._id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    city: admin.city,
    location: admin.location,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
});
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        const admin = await User_1.default.findOne({ email: normalizedEmail }).select("+password");
        if (!admin || String(admin.role).toLowerCase() !== "admin") {
            res.status(401).json({ message: "Invalid admin credentials" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid admin credentials" });
            return;
        }
        const token = (0, jwt_1.generateToken)(admin.id);
        res.status(200).json({
            message: "Admin login successful",
            token,
            admin: sanitizeAdmin({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                city: admin.city,
                location: admin.location,
                role: String(admin.role),
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
            }),
        });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.adminLogin = adminLogin;
const getAdminProfile = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    res.status(200).json({
        admin: sanitizeAdmin({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            city: req.user.city,
            location: req.user.location,
            role: String(req.user.role),
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
        }),
    });
};
exports.getAdminProfile = getAdminProfile;
const getDashboardStats = async (_req, res) => {
    try {
        const [totalUsers, totalEvents] = await Promise.all([
            User_1.default.countDocuments(),
            Event_1.default.countDocuments(),
        ]);
        let totalRegistrations = 0;
        try {
            totalRegistrations = await mongoose_1.default.connection
                .collection("registrations")
                .countDocuments({});
        }
        catch (_error) {
            totalRegistrations = 0;
        }
        res.status(200).json({
            totalUsers,
            totalEvents,
            totalRegistrations,
        });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getDashboardStats = getDashboardStats;
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.default.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ users });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid user id" });
            return;
        }
        const deletedUser = await User_1.default.findByIdAndDelete(id).select("-password");
        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser,
        });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteUserById = deleteUserById;
