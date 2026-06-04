import React from "react";
import { NotificationItem } from "../../models/notification";
import { getNotificationIcon } from "./notification.utils";
import { timeAgo } from "../../utils/time-formate";

interface INotificationComponentProps {
  notifications: NotificationItem[];
  showNotification: boolean;
  setShowNotification: (show: boolean) => void;
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationComponent: React.FC<INotificationComponentProps> = ({
  notifications,
  showNotification,
  setShowNotification,
  unreadCount,
  onMarkAsRead,
}) => {
  if (!showNotification) {
    return null;
  }

  return (
    <div className="absolute right-0 top-12 z-50 w-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          <p className="text-xs text-slate-400">{unreadCount} unread</p>
        </div>
        <button
          className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          onClick={() => setShowNotification(false)}
        >
          <i className="fas fa-times text-sm"></i>
        </button>
      </div>
      <div className="max-h-[26rem] overflow-y-auto p-2">
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notify) => {
              const { icon, textColor } = getNotificationIcon(notify.type);
              return (
                <button
                  key={notify._id}
                  type="button"
                  onClick={() => onMarkAsRead(notify._id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all hover:bg-white/5 ${
                    notify.isRead ? "border-white/5 bg-white/[0.02]" : "border-blue-500/20 bg-blue-500/10"
                  }`}
                >
                  <span className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 ${textColor}`}>
                    <i className={`fa-solid ${icon}`}></i>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-semibold ${notify.isRead ? "text-slate-300" : "text-white"}`}>
                      {notify.title}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-slate-400">
                      {notify.body}
                    </span>
                    <span className="mt-2 block text-xs text-slate-500">
                      {timeAgo(notify.createdAt)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-3 py-10 text-center text-sm text-slate-400">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationComponent;
