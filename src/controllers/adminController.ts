import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Event from "../models/Event";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middlewares/authMiddleware";

interface AdminLoginBody {
  email: string;
  password: string;
}

const sanitizeAdmin = (admin: {
  _id: unknown;
  name: string;
  email: string;
  phone: string;
  city: string;
  location: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
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

export const adminLogin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as AdminLoginBody;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!admin || String(admin.role).toLowerCase() !== "admin") {
      res.status(401).json({ message: "Invalid admin credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid admin credentials" });
      return;
    }

    const token = generateToken(admin.id);

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
  } catch (_error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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

export const getDashboardStats = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const [totalUsers, totalEvents] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
    ]);

    let totalRegistrations = 0;

    try {
      totalRegistrations = await mongoose.connection
        .collection("registrations")
        .countDocuments({});
    } catch (_error) {
      totalRegistrations = 0;
    }

    res.status(200).json({
      totalUsers,
      totalEvents,
      totalRegistrations,
    });
  } catch (_error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (_error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id).select("-password");

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (_error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
