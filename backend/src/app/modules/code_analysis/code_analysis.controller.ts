import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { CodeAnalysisService } from "./code_analysis.service";

const analyzeSwift = catchAsync(async (req: Request, res: Response) => {
  const result = await CodeAnalysisService.analyzeSwiftCode(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Swift code analyzed successfully",
    data: result,
  });
});

export const CodeAnalysisController = {
  analyzeSwift,
};
