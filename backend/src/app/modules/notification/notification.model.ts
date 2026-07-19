import { model, Schema } from "mongoose";
import { INotification, NotificationModel } from "./notification.interface";

const NotificationSchema: Schema<INotification> = new Schema<
  INotification,
  NotificationModel
>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);
NotificationSchema.index({ userId: 1, createdAt: -1 });
export const Notification = model<INotification, NotificationModel>(
  "Notification",
  NotificationSchema
);