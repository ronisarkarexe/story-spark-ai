import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { ReadingProgressService } from "./reading_progress.service";
import { getToken } from "../../middleware/token";

const saveProgress = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const { storyId, progress, lastScrollPosition } = req.body;
  const result = await ReadingProgressService.saveReadingProgress(
    token,
    storyId,
    progress,
    lastScrollPosition
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reading progress saved successfully",
    data: result,
  });
});

const getProgress = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const { storyId } = req.params;
  const result = await ReadingProgressService.getReadingProgress(token, storyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reading progress retrieved successfully",
    data: result,
  });
});

const getRecentProgress = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const result = await ReadingProgressService.getRecentProgressList(token, limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent reading progress retrieved successfully",
    data: result,
  });
});

const deleteProgress = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const { storyId } = req.params;
  const result = await ReadingProgressService.deleteReadingProgress(token, storyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reading progress deleted successfully",
    data: result,
  });
});

export const ReadingProgressController = {
  saveProgress,
  getProgress,
  getRecentProgress,
  deleteProgress,
};
