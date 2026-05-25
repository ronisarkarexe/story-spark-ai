import { Schema, model } from "mongoose";

export interface IGuestUsage {
  guestId: string;
  requestCount: number;
  lastRequestAt: Date;
}

const GuestUsageSchema = new Schema<IGuestUsage>(
  {
    guestId: { type: String, required: true, unique: true, index: true },
    requestCount: { type: Number, default: 0, min: 0 },
    lastRequestAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const GuestUsage = model<IGuestUsage>("GuestUsage", GuestUsageSchema);
