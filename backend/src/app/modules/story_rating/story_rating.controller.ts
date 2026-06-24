import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { StoryRatingService } from "./story_rating.service";

const createOrUpdateRating = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { storyId, rating, review } = req.body;

  const result = await StoryRatingService.rateStory(
    userId,
    storyId,
    rating,
    review
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rating submitted successfully",
    data: result,
  });
});

const getStoryRatings = catchAsync(async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await StoryRatingService.getStoryRatings(storyId, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story ratings retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAverageRating = catchAsync(async (req: Request, res: Response) => {
  const { storyId } = req.params;

  const result = await StoryRatingService.getAverageRating(storyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Average rating retrieved successfully",
    data: result,
  });
});

const deleteRating = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { ratingId } = req.params;

  const result = await StoryRatingService.deleteRating(userId, ratingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const getTopRatedStories = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await StoryRatingService.getTopRatedStories(limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top rated stories retrieved successfully",
    data: result,
  });
});

export const StoryRatingController = {
  createOrUpdateRating,
  getStoryRatings,
  getAverageRating,
  deleteRating,
  getTopRatedStories,
};
