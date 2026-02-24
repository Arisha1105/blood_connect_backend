"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 150,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000,
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
    },
    city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    organizer: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    requiredBloodGroups: {
        type: [String],
        default: [],
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
const Event = (0, mongoose_1.model)("Event", eventSchema);
exports.default = Event;
