import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { FeedbackService } from "./feedback.service";

const submitFeedback = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await FeedbackService.submitFeedback(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Feedback submitted successfully",
    data: result,
  });
});

export const FeedbackController = { submitFeedback };
