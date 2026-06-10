import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { StoryInspirationService } from "./story_inspiration.service";

const createStoryInspiration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await StoryInspirationService.createStoryInspiration(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story inspiration generated successfully",
      data: result,
    });
  }
);

export const StoryInspirationController = {
  createStoryInspiration,
};
