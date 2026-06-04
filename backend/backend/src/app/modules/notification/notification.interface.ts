import { Model, Types } from "mongoose";

export interface NotificationPayload {
  title: string;
  body: string;
}

export interface INotification {
  userId: Types.ObjectId;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
}

export type NotificationModel = Model<INotification, object>;
