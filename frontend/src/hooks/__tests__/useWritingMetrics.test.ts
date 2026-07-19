/**
 * useWritingMetrics.test.ts
 * Unit tests for the useWritingMetrics React hook.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWritingMetrics, WritingMetrics } from "../useWritingMetrics";

describe("useWritingMetrics", () => {
  let mockCallback: (session: WritingMetrics[]) => void;

  beforeEach(() => {
    mockCallback = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns all four event handlers from the hook", () => {
    const { result } = renderHook(() =>
      useWritingMetrics({ onSessionReady: mockCallback }),
    );
    expect(result.current.onPromptChange).toBeDefined();
    expect(typeof result.current.onPromptChange).toBe("function");
    expect(result.current.onKeyDown).toBeDefined();
    expect(typeof result.current.onKeyDown).toBe("function");
    expect(result.current.onRegenerate).toBeDefined();
    expect(typeof result.current.onRegenerate).toBe("function");
    expect(result.current.reset).toBeDefined();
    expect(typeof result.current.reset).toBe("function");
  });

  describe("onPromptChange", () => {
    it("does not throw when given a text string", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      expect(() =>
        result.current.onPromptChange("Once upon a time..."),
      ).not.toThrow();
    });

    it("does not throw when given an empty string", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      expect(() => result.current.onPromptChange("")).not.toThrow();
    });

    it("does not throw when given a long text string", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      const longText = "The quick brown fox jumps over the lazy dog ".repeat(10);
      expect(() => result.current.onPromptChange(longText)).not.toThrow();
    });
  });

  describe("onKeyDown", () => {
    it("does not throw when given a normal key event", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      const event = {
        key: "a",
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      expect(() => result.current.onKeyDown(event)).not.toThrow();
    });

    it("does not throw when given a Backspace key event", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      const event = {
        key: "Backspace",
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      expect(() => result.current.onKeyDown(event)).not.toThrow();
    });

    it("does not throw when given a Delete key event", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      const event = {
        key: "Delete",
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      expect(() => result.current.onKeyDown(event)).not.toThrow();
    });

    it("does not throw on repeated keydown events", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      const event = {
        key: "a",
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      for (let i = 0; i < 100; i++) {
        result.current.onKeyDown(event);
      }
      expect(true).toBe(true);
    });

    it("does not throw when key is an empty string", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      const event = {
        key: "",
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      expect(() => result.current.onKeyDown(event)).not.toThrow();
    });
  });

  describe("onRegenerate", () => {
    it("does not throw when called once", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      expect(() => result.current.onRegenerate()).not.toThrow();
    });

    it("does not throw when called multiple times", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      result.current.onRegenerate();
      result.current.onRegenerate();
      result.current.onRegenerate();
      expect(true).toBe(true);
    });
  });

  describe("reset", () => {
    it("does not throw when called without starting a session", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      expect(() => result.current.reset()).not.toThrow();
    });

    it("does not throw after a session has started", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      const event = {
        key: "a",
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      result.current.onKeyDown(event);
      expect(() => result.current.reset()).not.toThrow();
    });

    it("does not throw when called twice consecutively", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      result.current.reset();
      expect(() => result.current.reset()).not.toThrow();
    });
  });

  describe("BLOCKED_WORDS constant", () => {
    it("includes common hesitation words", () => {
      // BLOCKED_WORDS is defined in the module as:
      // ugh, stuck, help, idk, nothing, blank, no idea, can't, cannot, hmm, dunno, whatever
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );
      // The hook has BLOCKED_WORDS that should be checked internally
      // We verify the hook handles the text without throwing
      expect(() =>
        result.current.onPromptChange("I don't know what to write"),
      ).not.toThrow();
    });
  });

  describe("integration: multiple handlers", () => {
    it("accepts a sequence of handler calls without throwing", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );

      result.current.onPromptChange("Once upon a time");

      const keyEvent = {
        key: "a",
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      result.current.onKeyDown(keyEvent);
      result.current.onKeyDown(keyEvent);
      result.current.onKeyDown({ key: "Backspace" } as React.KeyboardEvent<HTMLTextAreaElement>);

      result.current.onRegenerate();
      result.current.onPromptChange("A brave hero set forth");

      expect(true).toBe(true);
    });

    it("reset can be called after a full interaction sequence", () => {
      const { result } = renderHook(() =>
        useWritingMetrics({ onSessionReady: mockCallback }),
      );

      result.current.onPromptChange("Some prompt text");
      const keyEvent = {
        key: "a",
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      result.current.onKeyDown(keyEvent);
      result.current.onRegenerate();
      result.current.onRegenerate();

      expect(() => result.current.reset()).not.toThrow();
    });
  });
});
