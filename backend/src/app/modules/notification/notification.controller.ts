import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { routeParam } from "../../../shared/route_param";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { ITokenPayload } from "../../../interfaces/token";

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;
  const result = await NotificationService.getUserNotifications(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications fetched successfully!",
    data: result,
  });
});

const markNotificationAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const notificationId = routeParam(req.params.id);
    const token = req.user as ITokenPayload;
    const result = await NotificationService.markNotificationAsRead(notificationId, token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notification marked as read successfully!",
      data: result,
    });
  }
);

export const NotificationController = {
  getUserNotifications,
  markNotificationAsRead,
};
