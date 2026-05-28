import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../shared/catch_async";
import sendResponse from "../shared/send_response";
import { StoryBranchingService } from "../services/storyBranchingService";

const createBranchingStory = catchAsync(async (req: Request, res: Response) => {
  const result = await StoryBranchingService.createBranchingStory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Branching story generated successfully!",
    data: result,
  });
});

export const StoryBranchingController = {
  createBranchingStory,
};