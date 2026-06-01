import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { RecommendationService } from "./recommendation.service";
import { getToken } from "../../middleware/token";

const getPersonalizedRecommendations = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const result = await RecommendationService.getPersonalizedRecommendations(token);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Personalized recommendations fetched successfully!",
    data: result,
  });
});

export const RecommendationController = {
  getPersonalizedRecommendations,
};
