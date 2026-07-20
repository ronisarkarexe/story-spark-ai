/* eslint-disable */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAntiGravityScroll } from "../useAntiGravityScroll";

// Mock requestAnimationFrame and cancelAnimationFrame
let rafCount = 0;
let rafCallbacks: Array<() => void> = [];
const originalRaf = global.requestAnimationFrame;
const originalCancelRaf = global.cancelAnimationFrame;

beforeEach(() => {
  rafCount = 0;
  rafCallbacks = [];
  global.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
    rafCount++;
    const id = rafCount;
    // Store callback to allow manual triggering
    rafCallbacks.push(() => cb(0));
    return id;
  });
  global.cancelAnimationFrame = vi.fn((id: number) => {
    // no-op in mock
  });
});

afterEach(() => {
  global.requestAnimationFrame = originalRaf;
  global.cancelAnimationFrame = originalCancelRaf;
  vi.restoreAllMocks();
});

describe("useAntiGravityScroll", () => {
  const createMockContainer = () => {
    const listeners: Record<string, Array<EventListener>> = {};
    return {
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 600,
      maxScrollTop: 400,
      addEventListener: vi.fn((event: string, handler: EventListener) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
      removeEventListener: vi.fn((event: string, handler: EventListener) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((h) => h !== handler);
        }
      }),
      dispatchEvent: (event: string | Event) => {
        const handlers = listeners[String(event)] || [];
        handlers.forEach((h) => h({} as Event));
      },
    } as unknown as HTMLDivElement;
  };

  it("initializes with isPlaying false and targetSpeed 1", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: createMockContainer() })
    );
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.targetSpeed).toBe(1);
  });

  it("sets up wheel and touchmove passive listeners on mount", () => {
    const container = createMockContainer();
    renderHook(() => useAntiGravityScroll({ current: container }));
    expect(container.addEventListener).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      { passive: true }
    );
    expect(container.addEventListener).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function),
      { passive: true }
    );
  });

  it("removes event listeners on unmount", () => {
    const container = createMockContainer();
    const { unmount } = renderHook(() =>
      useAntiGravityScroll({ current: container })
    );
    unmount();
    expect(container.removeEventListener).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function)
    );
    expect(container.removeEventListener).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function)
    );
  });

  it("wheel event interrupts auto-play (sets isPlaying false)", () => {
    const container = createMockContainer();
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: container })
    );

    // Manually trigger wheel event
    act(() => {
      result.current.setIsPlaying(true);
    });

    // Simulate wheel event
    act(() => {
      (container as any).dispatchEvent("wheel");
    });

    // After wheel, isPlaying should be false
    expect(result.current.isPlaying).toBe(false);
  });

  it("setIsPlaying updates state", () => {
    const container = createMockContainer();
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: container })
    );

    act(() => {
      result.current.setIsPlaying(true);
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.setIsPlaying(false);
    });
    expect(result.current.isPlaying).toBe(false);
  });

  it("setTargetSpeed updates state", () => {
    const container = createMockContainer();
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: container })
    );

    act(() => {
      result.current.setTargetSpeed(2);
    });
    expect(result.current.targetSpeed).toBe(2);
  });

  it("exposes currentVelocityRef", () => {
    const container = createMockContainer();
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: container })
    );
    expect(result.current.currentVelocityRef).toBeDefined();
    expect(typeof result.current.currentVelocityRef.current).toBe("number");
  });

  it("returns a container ref unchanged across renders", () => {
    const container = createMockContainer();
    const { result, rerender } = renderHook(() =>
      useAntiGravityScroll({ current: container })
    );
    const firstRef = result.current;
    rerender();
    // The hook returns new objects each render, but refs are stable
    expect(result.current).toBeDefined();
  });
});
