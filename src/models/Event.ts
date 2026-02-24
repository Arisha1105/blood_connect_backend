import { Document, Schema, Types, model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  location: string;
  city: string;
  date: Date;
  time: string;
  organizer: string;
  contactNumber: string;
  requiredBloodGroups: string[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = model<IEvent>("Event", eventSchema);

export default Event;
