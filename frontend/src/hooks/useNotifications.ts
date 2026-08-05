import { useCallback, useEffect, useMemo, useState } from "react";
import { isLoggedIn } from "../services/auth.service";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../redux/apis/notification.api";
import { getSocketIo } from "../socket/socket.oi";
import type { NotificationItem, INotification } from "../models/notification";

/**
 * Notification bell: REST + Socket.IO real-time updates.
 * Socket.IO listens for the canonical notification event and keeps REST data fresh.
 */
export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [realtimeNotifications, setRealtimeNotifications] = useState<INotification[]>([]);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(() => isLoggedIn());

  // Keep isAuthed reactive to auth changes from this tab and other tabs
  useEffect(() => {
    const handleAuthChange = () => setIsAuthed(isLoggedIn());
    window.addEventListener("story-spark-auth-change", handleAuthChange);
    return () => window.removeEventListener("story-spark-auth-change", handleAuthChange);
  }, []);


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

    // REST data is added first — real-time data is added last and wins
    // for duplicate IDs, since real-time state is always more up-to-date.
    for (const notification of [...baseNotifications, ...realtimeNotifications]) {
      merged.set(notification._id, notification);
    }

    return [...merged.values()].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  }, [data, realtimeNotifications]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!data && isAuthed) {
      void refetch();
    }
  }, [data, isAuthed, refetch]);

  const close = useCallback(() => setIsOpen(false), []);

  const markAsRead = async (notificationId: string) => {
    try {
      setMutationError(null);
      await markNotificationRead(notificationId).unwrap();
    } catch (error) {
      const msg = "Failed to mark notification as read. Please try again.";
      console.error(msg, error);
      setMutationError(msg);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      setMutationError(null);
      await markAllRead().unwrap();
      // Optimistically clear realtime state so the badge drops immediately
      setRealtimeNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      const msg = "Failed to mark all notifications as read. Please try again.";
      console.error(msg, error);
      setMutationError(msg);
    }
  };

  const refreshNotifications = useCallback(() => {
    setRealtimeNotifications([]);
    void refetch();
  }, [refetch]);

  // Set up Socket.IO listeners
  useEffect(() => {
    if (!isAuthed) return;

    try {
      const socket = getSocketIo();
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
      socket.on("notification:new", handleNewNotification);
      socket.on("notification:updated", handleNotificationUpdated);
      socket.on("notification:all-read", handleAllRead);

      return () => {
        socket.off("connect", handleSocketConnected);
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
    mutationError, 
    toggle,
    close,
    markAsRead,
    markAllAsRead,
  };
};
