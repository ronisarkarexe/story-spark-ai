import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { TagService } from "./tag.service";

const getPopularTags = catchAsync(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const result = await TagService.getPopularTags(limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Popular tags fetched successfully!",
    data: result,
  });
});

const suggestTags = catchAsync(async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const result = await TagService.suggestTags(title || "", content || "");
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggested tags generated successfully!",
    data: result,
  });
});

const renameTag = catchAsync(async (req: Request, res: Response) => {
  const { oldTag, newTag } = req.body;
  const result = await TagService.renameTag(oldTag, newTag);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tag renamed successfully!",
    data: result,
  });
});

const deleteTag = catchAsync(async (req: Request, res: Response) => {
  const { tag } = req.params;
  const result = await TagService.deleteTag(tag);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tag deleted successfully!",
    data: result,
  });
});

const getRecommendations = catchAsync(async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const result = await TagService.getRecommendedStories(storyId, limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recommendations fetched successfully!",
    data: result,
  });
});

export const TagController = {
  getPopularTags,
  suggestTags,
  renameTag,
  deleteTag,
  getRecommendations,
};
