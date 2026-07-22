import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { KotlinAnalysisService } from "./kotlin_analysis.service";

const analyzeKotlin = catchAsync(async (req: Request, res: Response) => {
  const result = await KotlinAnalysisService.analyzeKotlinCode(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Kotlin code analyzed successfully",
    data: result,
  });
});

export const KotlinAnalysisController = {
  analyzeKotlin,
};
