"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const ALLOWED_FIELDS = [
    "phone",
    "city",
    "location",
    "lastDonationDate",
];
const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    bloodGroup: user.bloodGroup,
    dateOfBirth: user.dateOfBirth,
    city: user.city,
    location: user.location,
    lastDonationDate: user.lastDonationDate,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
const updateUserProfile = async (req, res) => {
    try {
        if (!req.user?._id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const requestBody = req.body;
        const requestKeys = Object.keys(requestBody);
        if (requestKeys.length === 0) {
            res.status(400).json({ message: "At least one updatable field is required" });
            return;
        }
        const invalidKeys = requestKeys.filter((key) => !ALLOWED_FIELDS.includes(key));
        if (invalidKeys.length > 0) {
            res.status(400).json({
                message: "Only phone, city, location, and lastDonationDate can be updated",
            });
            return;
        }
        const user = await User_1.default.findById(req.user._id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (typeof requestBody.phone !== "undefined") {
            if (typeof requestBody.phone !== "string" || !requestBody.phone.trim()) {
                res.status(400).json({ message: "phone must be a non-empty string" });
                return;
            }
            user.phone = requestBody.phone.trim();
        }
        if (typeof requestBody.city !== "undefined") {
            if (typeof requestBody.city !== "string" || !requestBody.city.trim()) {
                res.status(400).json({ message: "city must be a non-empty string" });
                return;
            }
            user.city = requestBody.city.trim();
        }
        if (typeof requestBody.location !== "undefined") {
            if (typeof requestBody.location !== "string" ||
                !requestBody.location.trim()) {
                res.status(400).json({ message: "location must be a non-empty string" });
                return;
            }
            user.location = requestBody.location.trim();
        }
        if (typeof requestBody.lastDonationDate !== "undefined") {
            if (requestBody.lastDonationDate === null) {
                user.lastDonationDate = undefined;
            }
            else if (typeof requestBody.lastDonationDate === "string") {
                const parsedDate = new Date(requestBody.lastDonationDate);
                if (Number.isNaN(parsedDate.getTime())) {
                    res.status(400).json({ message: "Invalid lastDonationDate" });
                    return;
                }
                user.lastDonationDate = parsedDate;
            }
            else {
                res.status(400).json({ message: "lastDonationDate must be a date string or null" });
                return;
            }
        }
        const updatedUser = await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: sanitizeUser(updatedUser),
        });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUserProfile = updateUserProfile;
