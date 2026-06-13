import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import { AnalysisService } from "./analysis.service";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { getToken } from "../../middleware/token";

const getDashboardAnalysis = catchAsync(async (req: Request, res: Response) => {
  const tokenPayload = getToken(req);
  const userId = tokenPayload._id || tokenPayload.userId || (req as any).user?._id || (req as any).user?.userId || (req as any).user?.id;
  const userRole = tokenPayload.role || (req as any).user?.role;

  const result = await AnalysisService.getDashboardAnalysis(userId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OK!",
    data: result,
  });
});

const analyzeStory = catchAsync(async (req: Request, res: Response) => {
  const { content } = req.body;
  const result = await AnalysisService.analyzeStory(content);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story analyzed successfully!",
    data: result,
  });
});

export const AnalysisController = {
  getDashboardAnalysis,
  analyzeStory,
};

