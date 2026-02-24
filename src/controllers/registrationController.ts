import { Response } from "express";
import { isValidObjectId } from "mongoose";
import { AuthRequest } from "../middlewares/authMiddleware";
import Event from "../models/Event";
import Registration from "../models/Registration";

interface CreateRegistrationBody {
  eventId?: string;
}

export const createRegistration = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { eventId } = req.body as CreateRegistrationBody;

    if (!eventId || typeof eventId !== "string") {
      res.status(400).json({ message: "eventId is required" });
      return;
    }

    if (!isValidObjectId(eventId)) {
      res.status(400).json({ message: "Invalid event id" });
      return;
    }

    const eventExists = await Event.exists({ _id: eventId });

    if (!eventExists) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingRegistration) {
      res.status(409).json({ message: "Already registered for this event" });
      return;
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
    });

    const populatedRegistration = await Registration.findById(registration._id)
      .populate("event")
      .populate("user", "name email");

    res.status(201).json({
      message: "Registered successfully",
      registration: populatedRegistration,
    });
  } catch (error: unknown) {
    const mongoError = error as { code?: number };

    if (mongoError?.code === 11000) {
      res.status(409).json({ message: "Already registered for this event" });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyRegistrations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const registrations = await Registration.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json({ registrations });
  } catch (_error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelRegistration = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid registration id" });
      return;
    }

    const deletedRegistration = await Registration.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedRegistration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    res.status(200).json({ message: "Registration cancelled successfully" });
  } catch (_error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRegistrations = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const registrations = await Registration.find()
      .populate("user", "name email phone bloodGroup city")
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json({ registrations });
  } catch (_error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
