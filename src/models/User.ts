import mongoose, { Document, Schema } from "mongoose";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  bloodGroup: BloodGroup;
  dateOfBirth: Date;
  city: string;
  location: string;
  lastDonationDate?: Date;
  role: "donor";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    lastDonationDate: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      default: "donor",
      enum: ["donor"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
