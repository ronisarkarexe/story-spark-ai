import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { VerifyEmailService } from "./verify_email.service";

const VerifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await VerifyEmailService.VerifyEmail(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent successfully!",
    data: result,
  });
});

const VerifyOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await VerifyEmailService.VerifyOtp(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully!",
    data: result,
  });
});

export const VerifyEmailController = {
  VerifyEmail,
  VerifyOtp,
};
