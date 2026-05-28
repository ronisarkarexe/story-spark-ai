import { IReport } from "./report.interface";
import { Report } from "./report.model";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

const createReport = async (payload: IReport) => {
  const existing = await Report.findOne({
    reportedBy: payload.reportedBy,
    targetId: payload.targetId,
    targetType: payload.targetType,
  });
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, "You have already reported this content.");
  }
  const result = await Report.create(payload);
  return result;
};

const getAllReports = async () => {
  const result = await Report.find().populate("reportedBy", "name email");
  return result;
};

export const ReportService = { createReport, getAllReports };