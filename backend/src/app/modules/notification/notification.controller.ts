import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { routeParam } from "../../../shared/route_param";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { ITokenPayload } from "../../../interfaces/token";
import { sendPushToUser } from "./push.service";
import { User } from "../user/user.model";

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;
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

const markNotificationAsRead = catchAsync(async (req: Request, res: Response) => {
  const notificationId = routeParam(req.params.id);
  const token = req.user as ITokenPayload;
  const result = await NotificationService.markNotificationAsRead(notificationId, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification marked as read successfully!",
    data: result,
  });
});

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

const subscribePush = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;
  const { subscription } = req.body;

  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid subscription payload",
      data: null,
    });
  }

  const userId = await NotificationService.resolveUserId(token);
  await User.findByIdAndUpdate(userId, {
    $addToSet: { pushSubscriptions: subscription },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Push subscription saved",
    data: null,
  });
});

const unsubscribePush = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;
  const { endpoint } = req.body;
  const userId = await NotificationService.resolveUserId(token);

  await User.findByIdAndUpdate(userId, {
    $pull: { pushSubscriptions: { endpoint } },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unsubscribed successfully",
    data: null,
  });
});

const updateNotificationPreferences = catchAsync(async (req: Request, res: Response) => {
  const token = req.user as ITokenPayload;
  const userId = await NotificationService.resolveUserId(token);

  await User.findByIdAndUpdate(userId, {
    notificationPreferences: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Preferences updated",
    data: null,
  });
});

export const NotificationController = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  subscribePush,
  unsubscribePush,
  updateNotificationPreferences,
};