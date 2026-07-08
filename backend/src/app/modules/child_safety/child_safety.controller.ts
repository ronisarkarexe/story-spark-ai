import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import { ChildSafetyService } from "./child_safety.service";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";

const analyzeStory = catchAsync(async (req: Request, res: Response) => {
  const { content } = req.body;
  const result = await ChildSafetyService.performSafetyAnalysis(content);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story analyzed for child safety successfully!",
    data: result,
  });
});

export const ChildSafetyController = {
  analyzeStory,
};
