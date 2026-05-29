import { Schema, model } from "mongoose";
import { IWriterApplication } from "./writer_application.interface";

const WriterApplicationSchema = new Schema<IWriterApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioLink: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const WriterApplication = model<IWriterApplication>(
  "WriterApplication",
  WriterApplicationSchema
);
