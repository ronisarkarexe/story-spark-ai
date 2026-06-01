import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { ReviewService } from "./review.service";
import { getToken } from "../../middleware/token";
const createReview = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const result = await ReviewService.createReview(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully!",
    data: result,
  });
});
const getPublishedReviews = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReviewService.getPublishedReviews();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews fetched successfully!",
      data: result,
    });
  }
);
const getPendingReviews = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReviewService.getPendingReviews();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Pending reviews fetched successfully!",
      data: result,
    });
  }
);
const approveReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ReviewService.approveReview(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review approved successfully!",
    data: result,
  });
});
export const ReviewController = {
  createReview,
  getPublishedReviews,
  getPendingReviews,
  approveReview,
};
