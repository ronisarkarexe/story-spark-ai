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

const getUserNotifications = async (
  token: ITokenPayload,
  page: number = 1,
  limit: number = 20
) => {
  const userId = await resolveUserId(token);
  const skip = (page - 1) * limit;

  // Promise.all use karke concurrent fetch aur count operation chalayenge performance ke liye
  const [notifications, total] = await Promise.all([
    Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ userId }),
  ]);

  return {
    data: notifications,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
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

const markAllNotificationsAsRead = async (token: ITokenPayload) => {
  const userId = await resolveUserId(token);

  // Single atomic updateMany — far cheaper than N individual updates
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );

  // Notify all connected tabs/sessions so the badge clears instantly everywhere
  emitNotificationStateToUser(userId, "notification:all-read", {
    modifiedCount: result.modifiedCount,
  });

  return { success: true, modifiedCount: result.modifiedCount };
};

const deleteAllNotifications = async (token: ITokenPayload) => {
  const userId = await resolveUserId(token);
  await Notification.deleteMany({ userId });
  emitNotificationStateToUser(userId, "notification:all-cleared", {});
  return { message: "All notifications cleared!" };
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  resolveUserId,
};
