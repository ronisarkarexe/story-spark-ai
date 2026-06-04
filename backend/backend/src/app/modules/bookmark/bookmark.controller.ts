import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import { routeParam } from "../../../shared/route_param";
import { getToken } from "../../middleware/token";
import sendResponse from "../../../shared/send_response";
import { BookmarkService } from "./bookmark.service";

const toggleBookmark = catchAsync(async (req: Request, res: Response) => {
  const storyId = routeParam(req.params.storyId);
  const token = await getToken(req);
  const result = await BookmarkService.toggleBookmark(storyId, token);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: { isBookmarked: result.isBookmarked },
  });
});

const getBookmarks = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const token = await getToken(req);
  const result = await BookmarkService.getBookmarks(token, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmarks fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const checkBookmarkStatus = catchAsync(async (req: Request, res: Response) => {
  const storyId = routeParam(req.params.storyId);
  const token = await getToken(req);
  const result = await BookmarkService.checkBookmarkStatus(storyId, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmark status checked successfully!",
    data: result,
  });
});

const deleteBookmark = catchAsync(async (req: Request, res: Response) => {
  const storyId = routeParam(req.params.storyId);
  const token = await getToken(req);
  const result = await BookmarkService.deleteBookmark(storyId, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
  });
});

export const BookmarkController = {
  toggleBookmark,
  getBookmarks,
  checkBookmarkStatus,
  deleteBookmark,
};
