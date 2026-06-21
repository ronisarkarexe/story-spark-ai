import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { SearchService } from "./search.service";

const search = catchAsync(async (req: Request, res: Response) => {
  const {
    q,
    type,
    genre,
    sortBy,
    page,
    limit,
    dateFrom,
    dateTo,
  } = req.query as Record<string, string>;

  if (!q || !q.trim()) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Search query (q) is required",
      data: null,
    });
  }

  const result = await SearchService.search({
    q,
    type: type as "story" | "user" | "tag" | "all",
    genre,
    sortBy: sortBy as "relevance" | "date" | "popularity",
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? Math.min(parseInt(limit, 10), 50) : 10,
    dateFrom,
    dateTo,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Search results fetched successfully",
    data: result,
  });
});

export const SearchController = { search };