import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { BugReportService } from "./bug_report.service";

const submitBugReport = catchAsync(async (req: Request, res: Response) => {
  const result = await BugReportService.submitBugReport(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Bug report submitted successfully",
    data: result,
  });
});

export const BugReportController = {
  submitBugReport,
};
