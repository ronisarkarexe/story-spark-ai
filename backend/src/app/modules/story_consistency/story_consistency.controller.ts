import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { analyzeConsistency, trackStoryFacts } from "./story_consistency.service";

const analyze = catchAsync(async (req: Request, res: Response) => {
  const { storyText } = req.body as { storyText: string };
  const result = await analyzeConsistency(storyText);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story consistency analysis complete.",
    data: result,
  });
});

const trackFacts = catchAsync(async (req: Request, res: Response) => {
  const { storyText } = req.body as { storyText: string };
  const result = await trackStoryFacts(storyText);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story fact tracking and temporal validation complete.",
    data: result,
  });
});

export const StoryConsistencyController = { analyze, trackFacts };