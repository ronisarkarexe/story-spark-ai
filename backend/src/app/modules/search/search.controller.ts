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

  const parsedPage = page ? Number(page) : 1;
  const parsedLimit = limit ? Number(limit) : 10;

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "page must be a positive integer",
      data: null,
    });
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "limit must be a positive integer",
      data: null,
    });
  }

  if (dateFrom && isNaN(new Date(dateFrom).getTime())) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "dateFrom is not a valid date",
      data: null,
    });
  }

  if (dateTo && isNaN(new Date(dateTo).getTime())) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "dateTo is not a valid date",
      data: null,
    });
  }

  const result = await SearchService.search({
    q,
    type: type as "story" | "user" | "tag" | "all",
    genre,
    sortBy: sortBy as "relevance" | "date" | "popularity",
    page: parsedPage,
    limit: Math.min(parsedLimit, 50),
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