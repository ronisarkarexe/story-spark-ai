import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import { getToken } from "../../middleware/token";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { AnalyticsService } from "./analytics.service";

const getAnalyticsOverview = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const result = await AnalyticsService.getOverview(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Analytics overview fetched successfully!",
    data: result,
  });
});

const getHeatmap = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const result = await AnalyticsService.getHeatmap(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Heatmap data fetched successfully!",
    data: result,
  });
});

const getGenreDistribution = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const result = await AnalyticsService.getGenreDistribution(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Genre distribution fetched successfully!",
    data: result,
  });
});

const getWordCloud = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const result = await AnalyticsService.getWordCloud(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Word cloud data fetched successfully!",
    data: result,
  });
});

const getProductiveHours = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const result = await AnalyticsService.getProductiveHours(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Productive hours fetched successfully!",
    data: result,
  });
});

export const AnalyticsController = {
  getAnalyticsOverview,
  getHeatmap,
  getGenreDistribution,
  getWordCloud,
  getProductiveHours,
};