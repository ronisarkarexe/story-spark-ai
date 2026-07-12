// @vitest-environment jsdom
/**
 * useAntiGravityScroll.test.ts
 * Unit tests for the useAntiGravityScroll hook: scroll physics (accel/decel),
 * user-interrupt handling, bottom-of-scroll detection, and rAF cleanup.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { RefObject } from "react";
import { useAntiGravityScroll } from "../useAntiGravityScroll";

/**
 * requestAnimationFrame is not time-based like setTimeout, so instead of
 * faking timers we capture the queued callback ourselves and invoke it
 * manually. This lets each test advance the physics loop exactly one
 * frame at a time and make assertions in between.
 */
function mockRaf() {
  let callback: FrameRequestCallback | null = null;
  let nextId = 1;

  const rafSpy = vi
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((cb: FrameRequestCallback) => {
      callback = cb;
      return nextId++;
    });

  const cafSpy = vi
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation(() => {
      callback = null;
    });

  return {
    rafSpy,
    cafSpy,
    // Runs the most recently queued frame callback, if any.
    runFrame(time = 0) {
      const cb = callback;
      callback = null; // consumed; hook will queue a new one if it wants another frame
      cb?.(time);
    },
    hasQueuedFrame() {
      return callback !== null;
    },
  };
}

/**
 * Builds a fake scrollable container. jsdom's scrollHeight/clientHeight are
 * read-only getters that always return 0, so they're redefined here to
 * simulate a real scrollable element.
 */
function createMockContainer({
  scrollTop = 0,
  scrollHeight = 1000,
  clientHeight = 500,
}: { scrollTop?: number; scrollHeight?: number; clientHeight?: number } = {}) {
  const container = document.createElement("div");

  Object.defineProperty(container, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(container, "clientHeight", {
    value: clientHeight,
    configurable: true,
  });

  container.scrollTop = scrollTop;

  return container;
}

function renderScrollHook(container: HTMLDivElement) {
  const containerRef = { current: container } as RefObject<HTMLDivElement | null>;
  return renderHook(() => useAntiGravityScroll(containerRef));
}

describe("useAntiGravityScroll hook", () => {
  let raf: ReturnType<typeof mockRaf>;

  beforeEach(() => {
    raf = mockRaf();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with isPlaying false and targetSpeed 1", () => {
    const container = createMockContainer();
    const { result } = renderScrollHook(container);

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.targetSpeed).toBe(1);
    expect(result.current.currentVelocityRef.current).toBe(0);
  });

  it("does not queue an animation frame while idle (not playing, zero velocity)", () => {
    const container = createMockContainer();
    renderScrollHook(container);

    expect(raf.hasQueuedFrame()).toBe(false);
  });

  describe("isPlaying / setIsPlaying state management", () => {
    it("updates isPlaying when setIsPlaying is called", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });

      expect(result.current.isPlaying).toBe(true);
    });

    it("queues an animation frame once playback starts", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });

      expect(raf.hasQueuedFrame()).toBe(true);
    });
  });

  describe("scroll velocity / targetSpeed multiplier", () => {
    it("accelerates scrollTop while playing, toward targetSpeed * baseSpeed", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });

      const initialScrollTop = container.scrollTop;

      act(() => {
        raf.runFrame();
      });

      expect(container.scrollTop).toBeGreaterThan(initialScrollTop);
      // First frame: velocity accelerates by 0.05 from 0 toward desiredSpeed (0.5)
      expect(result.current.currentVelocityRef.current).toBeCloseTo(0.05, 5);
    });

    it("reaches a higher steady-state velocity with a higher targetSpeed multiplier", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setTargetSpeed(4); // desiredSpeed = 4 * 0.5 = 2
        result.current.setIsPlaying(true);
      });

      // Run enough frames to reach the (higher) desired speed.
      act(() => {
        for (let i = 0; i < 100; i++) {
          raf.runFrame();
        }
      });

      expect(result.current.currentVelocityRef.current).toBeCloseTo(2, 5);
    });

    it("converges velocity toward baseSpeed when targetSpeed multiplier is 1", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });

      act(() => {
        for (let i = 0; i < 100; i++) {
          raf.runFrame();
        }
      });

      expect(result.current.currentVelocityRef.current).toBeCloseTo(0.5, 5);
    });
  });

  describe("deceleration (friction decay) when isPlaying is false", () => {
    it("decays velocity back to 0 by decayRate per frame after stopping", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });

      // Build up some velocity first.
      act(() => {
        for (let i = 0; i < 20; i++) {
          raf.runFrame();
        }
      });

      const velocityBeforeStop = result.current.currentVelocityRef.current;
      expect(velocityBeforeStop).toBeGreaterThan(0);

      act(() => {
        result.current.setIsPlaying(false);
      });

      act(() => {
        raf.runFrame();
      });

      // decayRate is 0.05 per frame
      expect(result.current.currentVelocityRef.current).toBeCloseTo(
        Math.max(0, velocityBeforeStop - 0.05),
        5
      );
    });

    it("eventually reaches and stays at 0 velocity, and stops requesting frames", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });

      act(() => {
        raf.runFrame(); // small amount of velocity built up
        result.current.setIsPlaying(false);
      });

      // Run enough frames for friction to fully decay the velocity to 0.
      act(() => {
        for (let i = 0; i < 20; i++) {
          raf.runFrame();
        }
      });

      expect(result.current.currentVelocityRef.current).toBe(0);
      // Once velocity hits 0 and isPlaying is false, no further frame is queued.
      expect(raf.hasQueuedFrame()).toBe(false);
    });
  });

  describe("bottom-of-scroll detection", () => {
    it("stops auto-play once scrollTop reaches the bottom", () => {
      const container = createMockContainer({
        scrollTop: 0,
        scrollHeight: 100, // maxScrollTop = 100 - 50 = 50
        clientHeight: 50,
      });
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setTargetSpeed(20); // large desired speed to reach bottom quickly
        result.current.setIsPlaying(true);
      });

      act(() => {
        for (let i = 0; i < 200; i++) {
          raf.runFrame();
          if (!result.current.isPlaying) break;
        }
      });

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentVelocityRef.current).toBe(0);
      expect(container.scrollTop).toBeGreaterThanOrEqual(49.5); // maxScrollTop - 0.5 threshold
    });
  });

  describe("passive wheel/touchmove listeners", () => {
    it("interrupts auto-scrolling on a wheel event", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });
      expect(result.current.isPlaying).toBe(true);

      act(() => {
        container.dispatchEvent(new Event("wheel"));
      });

      expect(result.current.isPlaying).toBe(false);
    });

    it("interrupts auto-scrolling on a touchmove event", () => {
      const container = createMockContainer();
      const { result } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });
      expect(result.current.isPlaying).toBe(true);

      act(() => {
        container.dispatchEvent(new Event("touchmove"));
      });

      expect(result.current.isPlaying).toBe(false);
    });

    it("registers the listeners as passive", () => {
      const container = createMockContainer();
      const addEventListenerSpy = vi.spyOn(container, "addEventListener");

      renderScrollHook(container);

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
    });

    it("removes the wheel/touchmove listeners on unmount", () => {
      const container = createMockContainer();
      const removeEventListenerSpy = vi.spyOn(container, "removeEventListener");

      const { unmount } = renderScrollHook(container);
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
  });

  describe("cleanup on unmount", () => {
    it("cancels the pending animation frame when the component unmounts", () => {
      const container = createMockContainer();
      const { result, unmount } = renderScrollHook(container);

      act(() => {
        result.current.setIsPlaying(true);
      });

      expect(raf.hasQueuedFrame()).toBe(true);

      unmount();

      expect(raf.cafSpy).toHaveBeenCalled();
    });

    it("does not attempt to cancel a frame if none was ever requested", () => {
      const container = createMockContainer();
      const { unmount } = renderScrollHook(container);

      unmount();

      expect(raf.cafSpy).not.toHaveBeenCalled();
    });
  });
});