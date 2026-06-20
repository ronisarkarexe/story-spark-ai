import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import * as StoryBibleService from "./story_bible.service";

export const getStoryBible = catchAsync(async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const result = await StoryBibleService.getStoryBible(storyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story Bible retrieved successfully",
    data: result,
  });
});

export const updateStoryBible = catchAsync(async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const payload = req.body;
  const result = await StoryBibleService.updateStoryBible(storyId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story Bible updated successfully",
    data: result,
  });
});

export const extractStoryBible = catchAsync(async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const result = await StoryBibleService.extractStoryBible(storyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story Bible extracted and updated successfully",
    data: result,
  });
});
