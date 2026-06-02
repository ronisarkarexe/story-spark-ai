import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { WriterApplicationService } from "./writer_application.service";
import { getToken } from "../../middleware/token";
import ApiError from "../../../errors/api_error";

const submitApplication = catchAsync(async (req: Request, res: Response) => {
  const tokenPayload = getToken(req);
  const userId = tokenPayload._id || tokenPayload.userId || (req as any).user?._id || (req as any).user?.userId || (req as any).user?.id;
  
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User ID could not be extracted from your session. Please try logging out and logging back in.");
  }
  
  const result = await WriterApplicationService.submitApplication(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Writer application submitted successfully",
    data: result,
  });
});

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await WriterApplicationService.getAllApplications();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Writer applications retrieved successfully",
    data: result,
  });
});

const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const tokenPayload = getToken(req);
  const adminId = tokenPayload._id || tokenPayload.userId || (req as any).user?._id || (req as any).user?.userId || (req as any).user?.id;

  if (!adminId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Admin ID could not be extracted.");
  }

  const result = await WriterApplicationService.updateApplicationStatus(id as string, status as "approved" | "rejected", adminId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Writer application ${status} successfully`,
    data: result,
  });
});

export const WriterApplicationController = {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
};
