import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { StoryBranchingService } from "./story_branching.service";
import {
  CreateBranchingStorySchema,
  CreateSegmentSchema,
  RecordChoiceSchema,
  GetBranchTreeSchema,
  ValidateBranchSchema,
} from "./story_branching.validation";
import { ZodError } from "zod";

/**
 * Create a new branching story
 */
export const createBranchingStory = catchAsync(async (req: Request, res: Response) => {
  try {
    const payload = CreateBranchingStorySchema.parse(req.body);
    const userId = (req.user as any)?.id;

    const result = await StoryBranchingService.createBranchingStory(
      payload.storyId,
      userId,
      payload.initialContent,
      payload.choices
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Branching story created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed",
        data: error.errors,
      });
    }
    throw error;
  }
});

/**
 * Create a new segment in the story tree
 */
export const createSegment = catchAsync(async (req: Request, res: Response) => {
  try {
    const payload = CreateSegmentSchema.parse(req.body);
    const userId = (req.user as any)?.id;

    const result = await StoryBranchingService.createSegment(
      payload.storyId,
      payload.parentSegmentId,
      userId,
      payload.content,
      payload.choices
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Segment created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed",
        data: error.errors,
      });
    }
    throw error;
  }
});

/**
 * Get complete branch tree for a story
 */
export const getBranchTree = catchAsync(async (req: Request, res: Response) => {
  try {
    const payload = GetBranchTreeSchema.parse({
      storyId: req.params.storyId,
      maxDepth: req.query.maxDepth ? parseInt(req.query.maxDepth as string) : undefined,
    });

    const result = await StoryBranchingService.getBranchTree(payload.storyId, payload.maxDepth);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Branch tree retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed",
        data: error.errors,
      });
    }
    throw error;
  }
});

/**
 * Record user choice and track progress
 */
export const recordUserChoice = catchAsync(async (req: Request, res: Response) => {
  try {
    const payload = RecordChoiceSchema.parse(req.body);
    const userId = (req.user as any)?.id;

    const result = await StoryBranchingService.recordUserChoice(
      userId,
      payload.storyId,
      payload.currentSegmentId,
      payload.choiceId,
      payload.choiceText
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Choice recorded successfully",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed",
        data: error.errors,
      });
    }
    throw error;
  }
});

/**
 * Get user's progress through a branching story
 */
export const getUserProgress = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const { storyId } = req.params;

  const result = await StoryBranchingService.getUserProgress(userId, storyId);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User progress retrieved successfully",
    data: result,
  });
});

/**
 * Get choice statistics for a story
 */
export const getChoiceStatistics = catchAsync(async (req: Request, res: Response) => {
  const { storyId } = req.params;

  const result = await StoryBranchingService.getChoiceStatistics(storyId);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Choice statistics retrieved successfully",
    data: result,
  });
});

/**
 * Get choice statistics summary
 */
export const getStatisticsSummary = catchAsync(async (req: Request, res: Response) => {
  const { storyId } = req.params;

  const result = await StoryBranchingService.getBranchStatisticsSummary(storyId);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Statistics summary retrieved successfully",
    data: result,
  });
});

/**
 * Validate branch integrity
 */
export const validateBranchIntegrity = catchAsync(async (req: Request, res: Response) => {
  try {
    const payload = ValidateBranchSchema.parse(req.body);

    const result = await StoryBranchingService.validateBranchIntegrity(payload.storyId);

    return sendResponse(res, {
      success: result.isValid,
      statusCode: result.isValid ? httpStatus.OK : httpStatus.BAD_REQUEST,
      message: result.isValid ? "Branch structure is valid" : "Branch structure has issues",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed",
        data: error.errors,
      });
    }
    throw error;
  }
});

/**
 * Delete a segment
 */
export const deleteSegment = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const { segmentId } = req.params;

  await StoryBranchingService.deleteSegment(segmentId, userId);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Segment deleted successfully",
    data: null,
  });
});

export const StoryBranchingController = {
  createBranchingStory,
  createSegment,
  getBranchTree,
  recordUserChoice,
  getUserProgress,
  getChoiceStatistics,
  getStatisticsSummary,
  validateBranchIntegrity,
  deleteSegment,
};
