import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { EducationalInsightsService } from "./educational-insights.service";
import ApiError from "../../../errors/api_error";
import { routeParam } from "../../../shared/route_param";

const generateEducationalInsights = catchAsync(
  async (req: Request, res: Response) => {
    const storyId = routeParam(req.params.storyId);
    const user = req.user;

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
    }

    const result =
      await EducationalInsightsService.generateEducationalInsights(
        storyId,
        user._id
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Educational insights generated successfully!",
      data: result,
    });
  }
);

export const EducationalInsightsController = {
  generateEducationalInsights,
};
