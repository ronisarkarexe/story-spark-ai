import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { ReportService } from "./report.service";
import { ITokenPayload } from "../../../interfaces/token";

const createReport = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;
  const reportedBy = token?._id;
  const payload = { ...req.body, reportedBy };
  const result = await ReportService.createReport(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Report submitted successfully",
    data: result,
  });
});

const getPendingCommentReports = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReportService.getPendingCommentReports();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Pending comment reports fetched successfully",
      data: result,
    });
  }
);

const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.getAllReports();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reports fetched successfully",
    data: result,
  });
});

const resolveReport = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, action } = req.body;
  const result = await ReportService.resolveReport(id, status, action);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Report resolved successfully",
    data: result,
  });
});

export const ReportController = {
  createReport,
  getAllReports,
  getPendingCommentReports,
  resolveReport,
};