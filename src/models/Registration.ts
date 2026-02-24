import { Document, Schema, Types, model } from "mongoose";

export interface IRegistration extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    status: {
      type: String,
      default: "registered",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = model<IRegistration>("Registration", registrationSchema);

export default Registration;
