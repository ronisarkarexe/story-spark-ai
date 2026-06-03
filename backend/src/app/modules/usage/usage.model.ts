import { Schema, model } from "mongoose";
import { IUsageRecord, UsageRecordModel } from "./usage.interface";

const usageRecordSchema = new Schema<IUsageRecord, UsageRecordModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["story_generate", "story_continue"],
      required: true,
    },
    billingPeriodStart: {
      type: Date,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent race conditions and ensure only one record per user/action/month
usageRecordSchema.index(
  { userId: 1, action: 1, billingPeriodStart: 1 },
  { unique: true }
);

export const UsageRecord = model<IUsageRecord, UsageRecordModel>(
  "UsageRecord",
  usageRecordSchema
);
