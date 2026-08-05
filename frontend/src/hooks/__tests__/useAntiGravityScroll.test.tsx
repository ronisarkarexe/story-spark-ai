import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAntiGravityScroll } from "../useAntiGravityScroll";

describe("useAntiGravityScroll hook", () => {
  let containerMock: HTMLDivElement;
  let scrollMock: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.useFakeTimers();

    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    scrollMock = {
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 500,
      addEventListener,
      removeEventListener,
    };

    containerMock = scrollMock as unknown as HTMLDivElement;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("registers wheel and touchmove passive listeners on mount", () => {
    renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );

    expect(scrollMock.addEventListener).toHaveBeenCalledTimes(2);
    expect(scrollMock.addEventListener).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      { passive: true }
    );
    expect(scrollMock.addEventListener).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function),
      { passive: true }
    );
  });

  it("removes event listeners on unmount", () => {
    const { unmount } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );
    unmount();

    expect(scrollMock.removeEventListener).toHaveBeenCalledTimes(2);
    expect(scrollMock.removeEventListener).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function)
    );
    expect(scrollMock.removeEventListener).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function)
    );
  });

  it("returns isPlaying as false by default", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );

    expect(result.current.isPlaying).toBe(false);
  });

  it("returns default targetSpeed of 1", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );

    expect(result.current.targetSpeed).toBe(1);
  });

  it("setIsPlaying updates isPlaying state", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.setIsPlaying(true);
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.setIsPlaying(false);
    });
    expect(result.current.isPlaying).toBe(false);
  });

  it("setTargetSpeed updates targetSpeed state", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );

    expect(result.current.targetSpeed).toBe(1);

    act(() => {
      result.current.setTargetSpeed(2);
    });
    expect(result.current.targetSpeed).toBe(2);

    act(() => {
      result.current.setTargetSpeed(0.5);
    });
    expect(result.current.targetSpeed).toBe(0.5);
  });

  it("returns currentVelocityRef as a ref", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );

    expect(result.current.currentVelocityRef).toBeDefined();
    expect(typeof result.current.currentVelocityRef.current).toBe("number");
  });

  it("does nothing when container ref is null", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: null })
    );

    expect(scrollMock.addEventListener).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it("user wheel event sets isPlaying to false (interrupt)", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );

    act(() => {
      result.current.setIsPlaying(true);
    });

    const wheelHandler = (
      scrollMock.addEventListener as ReturnType<typeof vi.fn>
    ).mock.calls.find((call) => call[0] === "wheel")?.[1] as (
      e: Event
    ) => void;

    act(() => {
      wheelHandler(new Event("wheel"));
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it("user touchmove event sets isPlaying to false (interrupt)", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );

    act(() => {
      result.current.setIsPlaying(true);
    });

    const touchHandler = (
      scrollMock.addEventListener as ReturnType<typeof vi.fn>
    ).mock.calls.find((call) => call[0] === "touchmove")?.[1] as (
      e: Event
    ) => void;

    act(() => {
      touchHandler(new Event("touchmove"));
    });

    expect(result.current.isPlaying).toBe(false);
  });
});
