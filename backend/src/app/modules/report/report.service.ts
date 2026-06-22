import { IReport } from "./report.interface";
import { Report } from "./report.model";
import ApiError from "../../../errors/api_error";
import { ReportStatus, ReportTargetType } from "../../../enums/report.enum";
import httpStatus from "http-status";

const createReport = async (payload: IReport) => {
  try {
    const result = await Report.create(payload);
    return result;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "You have already reported this content"
      );
    }
    throw error;
  }
};

const getAllReports = async () => {
  const result = await Report.find().populate("reportedBy", "name email");
  return result;
};
const getPendingCommentReports = async () => {
  return await Report.find({
    targetType: ReportTargetType.COMMENT,
    status: ReportStatus.PENDING,
  }).populate("reportedBy", "name email");
};

const reviewReport = async (reportId: string) => {
  const report = await Report.findByIdAndUpdate(
    reportId,
    {
      status: ReportStatus.REVIEWED,
    },
    { new: true }
  );

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Report not found");
  }

  return report;
};

const dismissReport = async (reportId: string) => {
  const report = await Report.findByIdAndUpdate(
    reportId,
    {
      status: ReportStatus.DISMISSED,
    },
    { new: true }
  );

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Report not found");
  }

  return report;
};



export const ReportService = {
  createReport,
  getAllReports,
  getPendingCommentReports,
  reviewReport,
  dismissReport,
};