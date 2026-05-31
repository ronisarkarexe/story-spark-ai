import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { ConsistencyService } from "./consistency.service";

const generateReport = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const result = await ConsistencyService.generateReport(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Consistency report generated successfully!",
    data: result,
  });
});

const getReport = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const result = await ConsistencyService.getReport(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Consistency report fetched successfully!",
    data: result,
  });
});

export const ConsistencyController = {
  generateReport,
  getReport,
};
