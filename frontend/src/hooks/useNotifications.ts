import { useCallback, useEffect, useMemo, useState } from "react";
import { isLoggedIn } from "../services/auth.service";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../redux/apis/notification.api";
import { connectSocket, disconnectSocket } from "../socket/socket.oi";
import type { NotificationItem } from "../models/notification";
import type { NotificationItem, INotification } from "../models/notification";

/**
 * Notification bell: REST + Socket.IO real-time updates.
 * Socket.IO listens for the canonical notification event and keeps REST data fresh.
 */
export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [realtimeNotifications, setRealtimeNotifications] = useState<INotification[]>([]);
  const isAuthed = isLoggedIn();

  const { data, isFetching, refetch } = useGetNotificationsQuery(undefined, {
    skip: !isAuthed,
  });
  const [markNotificationRead] = useMarkNotificationReadMutation();

  // Merge REST data with real-time updates
  const notifications = useMemo(() => {
    const baseNotifications = data ?? [];
const merged = new Map<string, NotificationItem>();

for (const notification of [...realtimeNotifications, ...baseNotifications]) {
  merged.set(notification._id, notification);
}

return [...merged.values()].sort((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();
  return bTime - aTime;
});
  }, [data, realtimeNotifications]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const toggle = () => {
    setIsOpen((prev) => !prev);
    if (!data && isAuthed) {
      void refetch();
    }
  };

  const close = () => setIsOpen(false);

  const markAsRead = async (notificationId: string) => {
    await markNotificationRead(notificationId).unwrap();
  };

  const refreshNotifications = useCallback(() => {
    setRealtimeNotifications([]);
    void refetch();
  }, [refetch]);

  // Set up Socket.IO listeners
  useEffect(() => {
    if (!isAuthed) {
      disconnectSocket();
      return;
    }

    try {
      const socket = connectSocket();
      if (!socket) {
        return;
      }

      const handleSocketConnected = () => {
        refreshNotifications();
      };

      const handleNotificationUpdated = () => {
        refreshNotifications();
      };

      // Listen for real-time notifications
      const handleNewNotification = (notification: INotification) => {
        console.log("[Story Spark] Received notification:", notification);
        setRealtimeNotifications((prev) => {
          const next = [notification, ...prev.filter((item) => item._id !== notification._id)];
          return next;
        });
      };

      socket.on("connect", handleSocketConnected);
      socket.on("reconnect", handleSocketConnected);
      socket.on("notification:new", handleNewNotification);
      socket.on("notification:updated", handleNotificationUpdated);

      return () => {
        socket.off("connect", handleSocketConnected);
        socket.off("reconnect", handleSocketConnected);
        socket.off("notification:new", handleNewNotification);
        socket.off("notification:updated", handleNotificationUpdated);
      };
    } catch (error) {
      console.warn("[Story Spark] Failed to set up Socket.IO notifications:", error);
    }
  }, [isAuthed, refreshNotifications]);

  return {
    notifications,
    unreadCount,
    isOpen,
    isFetching,
    toggle,
    close,
    markAsRead,
  };
};
