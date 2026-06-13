import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { StoryVisualizerService } from "./story_visualizer.service";
import { IStoryVisualizerPayload } from "./story_visualizer.interface";

const generateStoryboard = catchAsync(async (req: Request, res: Response) => {
  const controller = new AbortController();
  const onClose = () => {
    controller.abort();
  };
  req.on("close", onClose);

  try {
    const result = await StoryVisualizerService.generateStoryboard(
      req.body as IStoryVisualizerPayload,
      controller.signal
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Storyboard scenes generated successfully!",
      data: result,
    });
  } finally {
    req.off("close", onClose);
  }
});

export const StoryVisualizerController = {
  generateStoryboard,
};
