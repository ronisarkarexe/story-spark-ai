import { useCallback, useEffect, useMemo, useState } from "react";
import { isLoggedIn } from "../services/auth.service";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../redux/apis/notification.api";
import { connectSocket, disconnectSocket } from "../socket/socket.oi";
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
  const [markAllRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsReadMutation();

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

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    await markAllRead().unwrap();
    // Optimistically clear realtime state so the badge drops immediately
    setRealtimeNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
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

      // Real-time: mark-all-read fired by another tab or the server
      const handleAllRead = () => {
        setRealtimeNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        void refetch();
      };

      // Listen for real-time notifications
      const handleNewNotification = (notification: INotification) => {
        setRealtimeNotifications((prev) => [
          notification,
          ...prev.filter((item) => item._id !== notification._id),
        ]);
      };

      socket.on("connect", handleSocketConnected);
      socket.on("reconnect", handleSocketConnected);
      socket.on("notification:new", handleNewNotification);
      socket.on("notification:updated", handleNotificationUpdated);
      socket.on("notification:all-read", handleAllRead);

      return () => {
        socket.off("connect", handleSocketConnected);
        socket.off("reconnect", handleSocketConnected);
        socket.off("notification:new", handleNewNotification);
        socket.off("notification:updated", handleNotificationUpdated);
        socket.off("notification:all-read", handleAllRead);
      };
    } catch (error) {
      console.warn("[Story Spark] Failed to set up Socket.IO notifications:", error);
    }
  }, [isAuthed, refreshNotifications, refetch]);

  return {
    notifications,
    unreadCount,
    isOpen,
    isFetching,
    isMarkingAllRead,
    toggle,
    close,
    markAsRead,
    markAllAsRead,
  };
};
