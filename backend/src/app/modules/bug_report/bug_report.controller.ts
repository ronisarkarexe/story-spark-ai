import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { BugReportService } from "./bug_report.service";

const submitBugReport = catchAsync(async (req: Request, res: Response) => {
  const data = { ...req.body };

  if (req.file) {
    data.screenshotUrl = req.file.originalname;
    // Production mein yahan Cloudinary/S3 upload karna hoga
  }

  const result = await BugReportService.submitBugReport(data);

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