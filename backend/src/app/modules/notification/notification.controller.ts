import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { routeParam } from "../../../shared/route_param";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { ITokenPayload } from "../../../interfaces/token";

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;

  // URL query string se page aur limit parameters parse kar rahe hain safely
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await NotificationService.getUserNotifications(token, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications fetched successfully!",
    meta: result.meta,
    data: result.data,
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

const markAllNotificationsAsRead = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;
  const result = await NotificationService.markAllNotificationsAsRead(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All notifications marked as read successfully!",
    data: result,
  });
});

const deleteAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;
  const result = await NotificationService.deleteAllNotifications(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All notifications cleared successfully!",
    data: result,
  });
});

export const NotificationController = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
};
