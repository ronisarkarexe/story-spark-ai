import mongoose, { Schema, Document } from "mongoose";

export interface IFreeUsage extends Document {
  ip: string;
  requestsThisMonth: number;
  lastRequestDate: Date;
}

const freeUsageSchema = new Schema<IFreeUsage>(
  {
    ip: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    requestsThisMonth: {
      type: Number,
      default: 0,
    },
    lastRequestDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const FreeUsage = mongoose.model<IFreeUsage>("FreeUsage", freeUsageSchema);
