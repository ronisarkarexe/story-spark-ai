import { IReport } from "./report.interface";
import { Report } from "./report.model";

const createReport = async (payload: IReport) => {
  const result = await Report.create(payload);
  return result;
};

const getAllReports = async () => {
  const result = await Report.find().populate("reportedBy", "name email");
  return result;
};

export const ReportService = { createReport, getAllReports };