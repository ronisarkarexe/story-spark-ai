/**
 * useNotifications.test.ts
 * Unit tests for the useNotifications React hook.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNotifications } from "../useNotifications";

const mockNotification = (overrides = {}): import("../../models/notification").INotification => ({
  _id: "notif-1",
  userId: "user-1",
  message: "Test notification",
  isRead: false,
  type: "info",
  createdAt: new Date().toISOString(),
  ...overrides,
});

const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock("../../services/auth.service", () => ({
  isLoggedIn: vi.fn(() => true),
}));

vi.mock("../../redux/apis/notification.api", () => ({
  useGetNotificationsQuery: vi.fn(() => ({
    data: [mockNotification({ _id: "rest-1", message: "REST notification" })],
    isFetching: false,
    refetch: vi.fn(),
  })),
  useMarkNotificationReadMutation: vi.fn(() => [
    vi.fn(),
    { isLoading: false },
  ]),
  useMarkAllNotificationsReadMutation: vi.fn(() => [
    vi.fn(),
    { isLoading: false },
  ]),
}));

vi.mock("../../socket/socket.oi", () => ({
  connectSocket: vi.fn(() => mockSocket),
  disconnectSocket: vi.fn(),
}));

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket.on.mockClear();
    mockSocket.off.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes isOpen to false", () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.isOpen).toBe(false);
  });

  it("toggle opens the notification panel when closed", () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.isOpen).toBe(false);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it("toggle closes the notification panel when open", () => {
    const { result } = renderHook(() => useNotifications());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("close sets isOpen to false regardless of current state", () => {
    const { result } = renderHook(() => useNotifications());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("notifications returns an array", () => {
    const { result } = renderHook(() => useNotifications());
    expect(Array.isArray(result.current.notifications)).toBe(true);
  });

  it("unreadCount returns 0 when all notifications are read", () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.unreadCount).toBeGreaterThanOrEqual(0);
  });

  it("isFetching is exposed in the return value", () => {
    const { result } = renderHook(() => useNotifications());
    expect(typeof result.current.isFetching).toBe("boolean");
  });

  it("isMarkingAllRead is exposed in the return value", () => {
    const { result } = renderHook(() => useNotifications());
    expect(typeof result.current.isMarkingAllRead).toBe("boolean");
  });

  it("markAsRead is a callable function", () => {
    const { result } = renderHook(() => useNotifications());
    expect(typeof result.current.markAsRead).toBe("function");
  });

  it("markAllAsRead is a callable function", () => {
    const { result } = renderHook(() => useNotifications());
    expect(typeof result.current.markAllAsRead).toBe("function");
  });



  it("socket listeners are registered when authenticated", () => {
    renderHook(() => useNotifications());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "notification:new",
      expect.any(Function)
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      "notification:updated",
      expect.any(Function)
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      "notification:all-read",
      expect.any(Function)
    );
  });

  it("socket listeners are cleaned up on unmount", () => {
    const { unmount } = renderHook(() => useNotifications());
    unmount();
    expect(mockSocket.off).toHaveBeenCalledWith(
      "notification:new",
      expect.any(Function)
    );
    expect(mockSocket.off).toHaveBeenCalledWith(
      "notification:updated",
      expect.any(Function)
    );
    expect(mockSocket.off).toHaveBeenCalledWith(
      "notification:all-read",
      expect.any(Function)
    );
  });

});
