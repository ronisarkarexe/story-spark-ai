import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNotifications } from "../useNotifications";

// Shared mock functions at module scope
const mockRefetch = vi.fn();
const mockMarkRead = vi.fn();
const mockMarkAllRead = vi.fn();
const mockIsLoggedIn = vi.fn(() => true);
const mockConnectSocket = vi.fn(() => ({
  on: vi.fn(),
  off: vi.fn(),
}));

// Module-level query state
let queryData: undefined | ReturnType<typeof makeNotifications>;
let queryFetching = false;

interface NotificationItem {
  _id: string;
  isRead: boolean;
  title: string;
  message: string;
  createdAt: string;
  [key: string]: unknown;
}

function makeNotifications(id: string, overrides: Partial<NotificationItem> = {}): NotificationItem {
  return {
    _id: id,
    isRead: false,
    title: `Notification ${id}`,
    message: `Message ${id}`,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

vi.mock("../../services/auth.service", () => ({
  isLoggedIn: (...args: unknown[]) => mockIsLoggedIn(...args),
}));

vi.mock("../../redux/apis/notification.api", () => ({
  useGetNotificationsQuery: vi.fn(() => ({
    data: queryData,
    isFetching: queryFetching,
    refetch: mockRefetch,
  })),
  useMarkNotificationReadMutation: vi.fn(() => [mockMarkRead, { isLoading: false }]),
  useMarkAllNotificationsReadMutation: vi.fn(() => [mockMarkAllRead, { isLoading: false }]),
}));

vi.mock("../../socket/socket.oi", () => ({
  connectSocket: (...args: unknown[]) => mockConnectSocket(...args),
  disconnectSocket: vi.fn(),
}));

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryData = undefined;
    queryFetching = false;
    mockRefetch.mockResolvedValue(undefined);
    mockMarkRead.mockResolvedValue(undefined);
    mockMarkAllRead.mockResolvedValue(undefined);
    mockIsLoggedIn.mockReturnValue(true);
    mockConnectSocket.mockReturnValue({ on: vi.fn(), off: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("starts with isOpen false, empty notifications, and unreadCount 0", () => {
      const { result } = renderHook(() => useNotifications());
      expect(result.current.isOpen).toBe(false);
      expect(result.current.notifications).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
    });

    it("starts with isFetching false", () => {
      const { result } = renderHook(() => useNotifications());
      expect(result.current.isFetching).toBe(false);
    });

    it("starts with isMarkingAllRead false", () => {
      const { result } = renderHook(() => useNotifications());
      expect(result.current.isMarkingAllRead).toBe(false);
    });
  });

  describe("unreadCount", () => {
    it("returns 0 when all notifications are read", () => {
      queryData = [
        makeNotifications("n1", { isRead: true, title: "Read notification" }),
      ];

      const { result } = renderHook(() => useNotifications());
      expect(result.current.unreadCount).toBe(0);
    });

    it("counts only unread notifications", () => {
      queryData = [
        makeNotifications("n1", { isRead: false, title: "Unread 1" }),
        makeNotifications("n2", { isRead: true, title: "Read 1" }),
        makeNotifications("n3", { isRead: false, title: "Unread 2" }),
      ];

      const { result } = renderHook(() => useNotifications());
      expect(result.current.unreadCount).toBe(2);
    });
  });

  describe("toggle", () => {
    it("toggles isOpen from false to true", () => {
      const { result } = renderHook(() => useNotifications());
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("toggles isOpen from true to false", () => {
      const { result } = renderHook(() => useNotifications());
      act(() => result.current.toggle());
      expect(result.current.isOpen).toBe(true);

      act(() => result.current.toggle());
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("close", () => {
    it("sets isOpen to false regardless of current state", () => {
      const { result } = renderHook(() => useNotifications());
      act(() => result.current.toggle());
      expect(result.current.isOpen).toBe(true);

      act(() => result.current.close());
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("notification sorting", () => {
    it("sorts notifications by createdAt descending (newest first)", () => {
      const older = new Date("2026-01-01").toISOString();
      const newer = new Date("2026-01-03").toISOString();
      const middle = new Date("2026-01-02").toISOString();

      queryData = [
        makeNotifications("n1", { title: "Oldest", createdAt: older }),
        makeNotifications("n2", { title: "Newest", createdAt: newer }),
        makeNotifications("n3", { title: "Middle", createdAt: middle }),
      ];

      const { result } = renderHook(() => useNotifications());
      expect(result.current.notifications[0].title).toBe("Newest");
      expect(result.current.notifications[1].title).toBe("Middle");
      expect(result.current.notifications[2].title).toBe("Oldest");
    });
  });

  describe("auth skip", () => {
    it("skips fetching when user is not logged in", () => {
      mockIsLoggedIn.mockReturnValue(false);

      renderHook(() => useNotifications());

      // When not logged in, the hook should not call refetch
      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });
});
