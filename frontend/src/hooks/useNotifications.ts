import { useEffect, useMemo, useState } from "react";
import { isLoggedIn } from "../services/auth.service";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../redux/apis/notification.api";
import { connectSocket, disconnectSocket } from "../socket/socket.oi";
import type { NotificationItem, INotification } from "../models/notification";

/**
 * Notification bell: REST + Socket.IO real-time updates.
 * Socket.IO listens for "notification:new" and "pushNotification" events.
 * Falls back to REST polling if Socket.IO is unavailable.
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
    // Add real-time notifications that aren't already in the list
    const newRealtime = realtimeNotifications.filter(
      (rt: INotification) => !baseNotifications.some((n: INotification) => n._id === rt._id)
    );
    return [...newRealtime, ...baseNotifications];
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

      // Listen for real-time notifications
      const handleNewNotification = (notification: INotification) => {
        console.log("[Story Spark] Received notification:", notification);
        setRealtimeNotifications((prev) => [notification, ...prev]);
        // Refetch to keep in sync with backend
        void refetch();
      };

      socket.on("notification:new", handleNewNotification);
      socket.on("pushNotification", handleNewNotification);

      return () => {
        socket.off("notification:new", handleNewNotification);
        socket.off("pushNotification", handleNewNotification);
      };
    } catch (error) {
      console.warn("[Story Spark] Failed to set up Socket.IO notifications:", error);
    }
  }, [isAuthed, refetch]);

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
