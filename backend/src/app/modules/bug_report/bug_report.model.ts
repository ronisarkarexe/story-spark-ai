import mongoose, { Schema } from "mongoose";
import { IBugReport } from "./bug_report.interface";

const bugReportSchema = new Schema<IBugReport>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    severity: { type: String, required: true },
    description: { type: String, required: true },
    steps: { type: String, required: true },
    expected: { type: String, required: true },
    actual: { type: String, required: true },
    email: { type: String },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    screenshotUrl: { type: String },
  },
  { timestamps: true }
);

export const BugReport = mongoose.model<IBugReport>("BugReport", bugReportSchema);
