"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getAllEvents = exports.createEvent = void 0;
const mongoose_1 = require("mongoose");
const Event_1 = __importDefault(require("../models/Event"));
const EVENT_UPDATABLE_FIELDS = [
    "title",
    "description",
    "location",
    "city",
    "date",
    "time",
    "organizer",
    "contactNumber",
    "requiredBloodGroups",
];
const toDateOrNull = (value) => {
    if (typeof value !== "string") {
        return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const createEvent = async (req, res) => {
    try {
        if (!req.user?._id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { title, description, location, city, date, time, organizer, contactNumber, requiredBloodGroups, } = req.body;
        if (!title || !location || !city || !date || !time || !organizer || !contactNumber) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const parsedDate = toDateOrNull(date);
        if (!parsedDate) {
            res.status(400).json({ message: "Invalid date" });
            return;
        }
        if (typeof requiredBloodGroups !== "undefined" &&
            !Array.isArray(requiredBloodGroups)) {
            res.status(400).json({ message: "requiredBloodGroups must be an array of strings" });
            return;
        }
        if (Array.isArray(requiredBloodGroups) &&
            requiredBloodGroups.some((group) => typeof group !== "string")) {
            res.status(400).json({ message: "requiredBloodGroups must be an array of strings" });
            return;
        }
        const event = await Event_1.default.create({
            title: title.trim(),
            description: description?.trim(),
            location: location.trim(),
            city: city.trim(),
            date: parsedDate,
            time: time.trim(),
            organizer: organizer.trim(),
            contactNumber: contactNumber.trim(),
            requiredBloodGroups: (requiredBloodGroups ?? []).map((group) => group.trim()),
            createdBy: req.user._id,
        });
        res.status(201).json({ message: "Event created successfully", event });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createEvent = createEvent;
const getAllEvents = async (_req, res) => {
    try {
        const events = await Event_1.default.find().sort({ date: 1 });
        res.status(200).json({ events });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllEvents = getAllEvents;
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(400).json({ message: "Invalid event id" });
            return;
        }
        const event = await Event_1.default.findById(id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json({ event });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getEventById = getEventById;
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(400).json({ message: "Invalid event id" });
            return;
        }
        const payload = req.body;
        const keys = Object.keys(payload);
        if (keys.length === 0) {
            res.status(400).json({ message: "At least one field is required for update" });
            return;
        }
        const invalidKeys = keys.filter((key) => !EVENT_UPDATABLE_FIELDS.includes(key));
        if (invalidKeys.length > 0) {
            res.status(400).json({ message: "Invalid fields in update payload" });
            return;
        }
        if (typeof payload.requiredBloodGroups !== "undefined") {
            if (!Array.isArray(payload.requiredBloodGroups)) {
                res.status(400).json({ message: "requiredBloodGroups must be an array of strings" });
                return;
            }
            if (payload.requiredBloodGroups.some((group) => typeof group !== "string")) {
                res.status(400).json({ message: "requiredBloodGroups must be an array of strings" });
                return;
            }
        }
        if (typeof payload.date !== "undefined") {
            const parsedDate = toDateOrNull(payload.date);
            if (!parsedDate) {
                res.status(400).json({ message: "Invalid date" });
                return;
            }
            payload.date = parsedDate;
        }
        const event = await Event_1.default.findById(id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        for (const key of keys) {
            const typedKey = key;
            const value = payload[typedKey];
            if (typedKey === "requiredBloodGroups" && Array.isArray(value)) {
                event.requiredBloodGroups = value.map((group) => group.trim());
                continue;
            }
            if (typedKey === "date") {
                event.date = value;
                continue;
            }
            if (typeof value === "string") {
                event[typedKey] = value.trim();
            }
        }
        const updatedEvent = await event.save();
        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(400).json({ message: "Invalid event id" });
            return;
        }
        const event = await Event_1.default.findByIdAndDelete(id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json({ message: "Event deleted successfully" });
    }
    catch (_error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteEvent = deleteEvent;
