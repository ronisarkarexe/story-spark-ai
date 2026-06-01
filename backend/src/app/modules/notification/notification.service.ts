import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { INotification } from "./notification.interface";
import { Notification } from "./notification.model";
import {
  emitNotificationStateToUser,
  emitNotificationToUser,
} from "../../../socket/notification.socket";

const createNotification = async (payload: INotification) => {
  const notification = await Notification.create(payload);
  emitNotificationToUser(notification.userId.toString(), notification);
  return notification;
};

const resolveUserId = async (token: ITokenPayload) => {
  if (token.userId) {
    return token.userId;
  }

  const user = await User.findOne({ email: token.email }).select("_id");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return user._id.toString();
};

const getUserNotifications = async (token: ITokenPayload) => {
  const userId = await resolveUserId(token);
  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });
  return notifications;
};

const markNotificationAsRead = async (
  notificationId: string,
  token: ITokenPayload
) => {
  const userId = await resolveUserId(token);
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found!");
  }

  emitNotificationStateToUser(userId, "notification:updated", notification);

  return notification;
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  resolveUserId,
};
