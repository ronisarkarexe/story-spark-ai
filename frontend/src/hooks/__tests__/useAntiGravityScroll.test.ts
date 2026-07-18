/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAntiGravityScroll } from "../useAntiGravityScroll";

describe("useAntiGravityScroll", () => {
  let containerMock: HTMLDivElement;
  let addEventListenerSpy: ReturnType<typeof vi.fn>;
  let removeEventListenerSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    addEventListenerSpy = vi.fn();
    removeEventListenerSpy = vi.fn();
    containerMock = {
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 500,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
    } as unknown as HTMLDivElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("registers wheel and touchmove passive listeners on mount", () => {
    const { unmount } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function),
      { passive: true }
    );
    unmount();
  });

  it("removes listeners on unmount", () => {
    const { unmount } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function)
    );
  });

  it("returns isPlaying false when container ref is null", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: null })
    );
    expect(result.current.isPlaying).toBe(false);
  });

  it("returns initial isPlaying false and targetSpeed 1", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.targetSpeed).toBe(1);
  });

  it("setIsPlaying updates isPlaying state", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );
    act(() => {
      result.current.setIsPlaying(true);
    });
    expect(result.current.isPlaying).toBe(true);
  });

  it("setTargetSpeed updates targetSpeed state", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );
    act(() => {
      result.current.setTargetSpeed(2);
    });
    expect(result.current.targetSpeed).toBe(2);
  });

  it("exposes currentVelocityRef as a ref with numeric current value", () => {
    const { result } = renderHook(() =>
      useAntiGravityScroll({ current: containerMock })
    );
    expect(result.current.currentVelocityRef).toBeDefined();
    expect(typeof result.current.currentVelocityRef.current).toBe("number");
  });
});
