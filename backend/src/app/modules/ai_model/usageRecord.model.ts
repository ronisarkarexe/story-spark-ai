import { Schema, model, Document } from "mongoose";

export interface IUsageRecord extends Document {
  userId: Schema.Types.ObjectId;
  action: "story_generate" | "story_continue";
  billingPeriodStart: Date;
  count: number;
}

const UsageRecordSchema = new Schema<IUsageRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: ["story_generate", "story_continue"],
      required: true,
    },
    billingPeriodStart: { type: Date, required: true },
    count: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate records and enable atomic checks
UsageRecordSchema.index(
  { userId: 1, action: 1, billingPeriodStart: 1 },
  { unique: true }
);

export const UsageRecord = model<IUsageRecord>("UsageRecord", UsageRecordSchema);
