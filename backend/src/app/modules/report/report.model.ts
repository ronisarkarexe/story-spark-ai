import mongoose, { Schema } from "mongoose";
import { IReport } from "./report.interface";
import { ReportReason, ReportStatus, ReportTargetType } from "../../../enums/report.enum";

const reportSchema = new Schema<IReport>(
  {
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: Object.values(ReportTargetType), required: true },
    reason: { type: String, enum: Object.values(ReportReason), required: true },
    description: { type: String },
    status: { type: String, enum: Object.values(ReportStatus), default: ReportStatus.PENDING },
  },
  { timestamps: true }
);

// Prevent the same user from reporting the same content more than once
reportSchema.index({ reportedBy: 1, targetId: 1, targetType: 1 }, { unique: true });

export const Report = mongoose.model<IReport>("Report", reportSchema);