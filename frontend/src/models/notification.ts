export interface NotificationItem {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
}

export interface NotificationListResponse {
  data: NotificationItem[];
  message?: string;
}
