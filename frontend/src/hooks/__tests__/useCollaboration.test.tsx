/* eslint-disable */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCollaboration } from "../useCollaboration";

// Create a shared socket mock at module scope
const mockSocket = {
  emit: vi.fn((event, data, cb) => {
    if (typeof cb === "function") {
      if (event === "collab:get_room") {
        cb({ room: mockRoom });
      }
    }
  }),
  on: vi.fn(),
  off: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock("socket.io-client", () => ({
  io: vi.fn(() => mockSocket),
}));

vi.mock("../../services/auth.service", () => ({
  getToken: vi.fn(() => "mock-token"),
}));

vi.mock("../../helpers/socket-url", () => ({
  resolveSocketUrl: vi.fn(() => "http://localhost:5000"),
}));

const mockRoom = {
  roomId: "room-1",
  createdBy: "user-1",
  participants: [
    { userId: "user-1", username: "Alice", color: "#ff0000", socketId: "sock-1" },
  ],
  story: [
    {
      authorId: "user-1",
      authorName: "Alice",
      color: "#ff0000",
      text: "Once upon a time...",
      isAI: false,
      timestamp: new Date(),
    },
  ],
  createdAt: new Date(),
};

describe("useCollaboration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with loading=true, error=null, room=null", () => {
    const { result } = renderHook(() =>
      useCollaboration({ roomId: undefined })
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.room).toBe(null);
  });

  it("socket does not connect when roomId is undefined", async () => {
    renderHook(() => useCollaboration({ roomId: undefined }));
    await act(async () => {});
    // When roomId is undefined, socket is never created so emit is never called
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it("socket connects and joins room when roomId is provided", async () => {
    const { result, unmount } = renderHook(() =>
      useCollaboration({ roomId: "room-1" })
    );

    await act(async () => {});

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "collab:join_room",
      expect.objectContaining({ roomId: "room-1" })
    );
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "collab:get_room",
      expect.objectContaining({ roomId: "room-1" }),
      expect.any(Function)
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.room).not.toBeNull();

    unmount();
  });

  it("socket disconnect is called on unmount", async () => {
    const { unmount } = renderHook(() =>
      useCollaboration({ roomId: "room-1" })
    );

    await act(async () => {});

    expect(mockSocket.disconnect).not.toHaveBeenCalled();
    unmount();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it("addText emits collab:add_text and collab:stop_typing", async () => {
    const { result, unmount } = renderHook(() =>
      useCollaboration({ roomId: "room-1" })
    );

    await act(async () => {});

    act(() => {
      result.current.addText("New story text");
    });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "collab:add_text",
      expect.objectContaining({ roomId: "room-1", text: "New story text" })
    );
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "collab:stop_typing",
      expect.objectContaining({ roomId: "room-1" })
    );

    unmount();
  });

  it("emitTyping emits collab:typing event", async () => {
    const { result, unmount } = renderHook(() =>
      useCollaboration({ roomId: "room-1" })
    );

    await act(async () => {});

    act(() => {
      result.current.emitTyping();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "collab:typing",
      expect.objectContaining({ roomId: "room-1" })
    );

    unmount();
  });

  it("stopTyping emits collab:stop_typing event", async () => {
    const { result, unmount } = renderHook(() =>
      useCollaboration({ roomId: "room-1" })
    );

    await act(async () => {});

    act(() => {
      result.current.stopTyping();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "collab:stop_typing",
      expect.objectContaining({ roomId: "room-1" })
    );

    unmount();
  });

  it("requestAiContinue emits collab:ai_continue", async () => {
    const { result, unmount } = renderHook(() =>
      useCollaboration({ roomId: "room-1" })
    );

    await act(async () => {});

    act(() => {
      result.current.requestAiContinue();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "collab:ai_continue",
      expect.objectContaining({ roomId: "room-1" })
    );

    unmount();
  });

  it("typingUsers is initially empty object", async () => {
    const { result, unmount } = renderHook(() =>
      useCollaboration({ roomId: "room-1" })
    );

    await act(async () => {});

    expect(result.current.typingUsers).toEqual({});
    unmount();
  });

  it("isAiThinking is initially false", async () => {
    const { result, unmount } = renderHook(() =>
      useCollaboration({ roomId: "room-1" })
    );

    await act(async () => {});

    expect(result.current.isAiThinking).toBe(false);
    unmount();
  });
});
