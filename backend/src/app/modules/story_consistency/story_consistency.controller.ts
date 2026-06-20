import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { analyzeConsistency } from "./story_consistency.service";

const analyze = catchAsync(async (req: Request, res: Response) => {
  const { storyText, storyId } = req.body as { storyText: string; storyId?: string };
  const result = await analyzeConsistency(storyText, storyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story consistency analysis complete.",
    data: result,
  });
});

export const StoryConsistencyController = { analyze };