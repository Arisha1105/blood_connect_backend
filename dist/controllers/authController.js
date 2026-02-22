"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isAtLeast18 = (dateOfBirth) => {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--;
    }
    return age >= 18;
};
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
const signup = async (req, res) => {
    try {
        const { name, email, password, phone, bloodGroup, dateOfBirth, city, location, lastDonationDate, } = req.body;
        if (!name ||
            !email ||
            !password ||
            !phone ||
            !bloodGroup ||
            !dateOfBirth ||
            !city ||
            !location) {
            res.status(400).json({ message: "All required fields must be provided" });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            res.status(400).json({ message: "Invalid email format" });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({ message: "Password must be at least 8 characters long" });
            return;
        }
        const dob = new Date(dateOfBirth);
        if (Number.isNaN(dob.getTime())) {
            res.status(400).json({ message: "Invalid dateOfBirth" });
            return;
        }
        if (!isAtLeast18(dob)) {
            res.status(400).json({ message: "User must be at least 18 years old" });
            return;
        }
        let parsedLastDonationDate;
        if (lastDonationDate) {
            parsedLastDonationDate = new Date(lastDonationDate);
            if (Number.isNaN(parsedLastDonationDate.getTime())) {
                res.status(400).json({ message: "Invalid lastDonationDate" });
                return;
            }
        }
        const existingUser = await User_1.default.findOne({ email: normalizedEmail });
        if (existingUser) {
            res.status(409).json({ message: "Email is already registered" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = await User_1.default.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone.trim(),
            bloodGroup,
            dateOfBirth: dob,
            city: city.trim(),
            location: location.trim(),
            lastDonationDate: parsedLastDonationDate,
        });
        const token = (0, jwt_1.generateToken)(user.id);
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: sanitizeUser(user),
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: "Email is already registered" });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User_1.default.findOne({ email: normalizedEmail }).select("+password");
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = (0, jwt_1.generateToken)(user.id);
        res.status(200).json({
            message: "Login successful",
            token,
            user: sanitizeUser({
                _id: user._id,
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
            }),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    res.status(200).json({ user: sanitizeUser(req.user) });
};
exports.getProfile = getProfile;
