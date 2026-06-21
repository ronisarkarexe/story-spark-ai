import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { AiEditorService } from "./ai_editor.service";
import ApiError from "../../../errors/api_error";

const analyzeStory = catchAsync(async (req: Request, res: Response) => {
  const { storyText } = req.body;

  if (!storyText || typeof storyText !== "string" || storyText.trim().length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please provide storyText as a non-empty string in the request body."
    );
  }

  const analysisResult = await AiEditorService.analyzeStoryText(storyText);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story consistency analysis completed successfully!",
    data: analysisResult,
  });
});

export const AiEditorController = {
  analyzeStory,
};
