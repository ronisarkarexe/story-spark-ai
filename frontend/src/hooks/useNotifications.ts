import { useMemo, useState } from "react";
import { isLoggedIn } from "../services/auth.service";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../redux/apis/notification.api";

/**
 * Notification bell: REST only. Socket.IO (`socket.oi.ts`) is disabled to avoid
 * slow page loads and unreliable realtime hosts; re-enable by restoring the
 * previous useEffect that called socketIo.connect / "notification:new".
 */
export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthed = isLoggedIn();

  const { data, isFetching, refetch } = useGetNotificationsQuery(undefined, {
    skip: !isAuthed,
  });
  const [markNotificationRead] = useMarkNotificationReadMutation();

  const notifications = useMemo(() => data ?? [], [data]);

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
