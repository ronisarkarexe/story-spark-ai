import { IReport } from "./report.interface";
import { Report } from "./report.model";
import ApiError from "../../../errors/api_error";
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

export const ReportService = { createReport, getAllReports };