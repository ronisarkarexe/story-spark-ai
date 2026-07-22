# useNotifications Hook

## Overview

The `useNotifications` hook manages the notification bell state for the Story Spark application. It merges REST API data with real-time Socket.IO events to provide a unified notifications list with unread counts, mark-as-read functionality, and a dropdown open/close toggle.

## File

`frontend/src/hooks/useNotifications.ts`

## Usage

```tsx
import { useNotifications } from "@/hooks/useNotifications";

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isOpen,
    isFetching,
    toggle,
    close,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <button onClick={toggle}>
      Notifications {unreadCount > 0 && `(${unreadCount})`}
    </button>
  );
}
```

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `notifications` | `NotificationItem[]` | Merged list of REST + real-time notifications, sorted by creation time (newest first) |
| `unreadCount` | `number` | Count of notifications where `isRead` is `false` |
| `isOpen` | `boolean` | Whether the notifications dropdown is currently open |
| `isFetching` | `boolean` | Whether the REST API fetch is in progress |
| `isMarkingAllRead` | `boolean` | Whether the mark-all-read mutation is in progress |
| `toggle` | `() => void` | Toggles the dropdown open/close state |
| `close` | `() => void` | Closes the dropdown |
| `markAsRead` | `(id: string) => Promise<void>` | Marks a specific notification as read via REST API |
| `markAllAsRead` | `() => Promise<void>` | Marks all notifications as read; optimistically clears realtime state |
| `refreshNotifications` | `() => void` | Clears realtime state and refetches from REST API |

## Architecture

### REST + Real-time Merge

The hook uses Redux RTK Query (`useGetNotificationsQuery`) for the base notification list. Socket.IO events are layered on top:

1. `notification:new` — A new notification arrives from the server; it is prepended to the realtime list.
2. `notification:updated` — An existing notification changed; triggers a refetch.
3. `notification:all-read` — A mark-all-read event fired from another tab or the server; updates the realtime state optimistically.

Both sources are merged in `notifications` using a `Map` keyed by `_id`, so realtime events never create duplicates.

### Authentication

`useNotifications` checks `isLoggedIn()` and skips the REST query if the user is unauthenticated. Socket.IO listeners are also disconnected when `isAuthed` becomes `false`.

## Prerequisites

- Redux store must include `notification.api` (RTK Query slice for `getNotifications`, `markNotificationRead`, `markAllNotificationsRead`).
- Socket.IO must be initialized with `connectSocket()` from `frontend/src/socket/socket.oi`.

## Related Files

- Hook: `frontend/src/hooks/useNotifications.ts`
- Redux API: `frontend/src/redux/apis/notification.api.ts`
- Auth guard: `frontend/src/services/auth.service.ts`
- Socket client: `frontend/src/socket/socket.oi.ts`
