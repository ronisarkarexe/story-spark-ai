import { useEffect, useMemo, useState } from "react";
import { getAccessToken } from "../services/auth.service";
import { socketIo } from "../socket/socket.oi";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../redux/apis/notification.api";
import { NotificationItem } from "../models/notification";
import { useAuthSession } from "./useAuthSession";

export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthSession();

  const { data, isFetching, refetch } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [liveNotifications, setLiveNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      return;
    }

    socketIo.auth = { token: getAccessToken() };
    socketIo.connect();

    const handleNotification = (notification: NotificationItem) => {
      setLiveNotifications((prev) => [notification, ...prev]);
    };

    socketIo.on("notification:new", handleNotification);
    return () => {
      socketIo.off("notification:new", handleNotification);
      socketIo.disconnect();
    };
  }, [isAuthenticated, user?.userId]);

  const notifications = useMemo(() => {
    const combined = [...(liveNotifications || []), ...(data || [])];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item._id)) {
        return false;
      }
      seen.add(item._id);
      return true;
    });
  }, [data, liveNotifications]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const toggle = () => {
    setIsOpen((prev) => !prev);
    if (!data && isAuthenticated) {
      void refetch();
    }
  };

  const close = () => setIsOpen(false);

  const markAsRead = async (notificationId: string) => {
    await markNotificationRead(notificationId).unwrap();
  };

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
