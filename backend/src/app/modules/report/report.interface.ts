import { ReportReason, ReportStatus, ReportTargetType } from "../../../enums/report.enum";
import { Types } from "mongoose";

export interface IReport {
  reportedBy: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: ReportTargetType;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt?: Date;
}