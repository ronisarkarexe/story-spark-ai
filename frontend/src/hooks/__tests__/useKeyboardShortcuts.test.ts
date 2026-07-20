/**
 * useKeyboardShortcuts.test.ts
 * Unit tests for the useKeyboardShortcuts React hook.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useKeyboardShortcuts from "../useKeyboardShortcuts";

const fireKeyDown = (partialProps: Partial<KeyboardEventInit> = {}) => {
  document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...partialProps }));
};

describe("useKeyboardShortcuts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure activeElement is the body before each test
    Object.defineProperty(document, "activeElement", {
      value: document.body,
      writable: true,
      configurable: true,
    });
  });

  it("calls onOpenHelp when Shift+/ is pressed", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: false })
    );

    fireKeyDown({ shiftKey: true, code: "Slash" });
    expect(onOpenHelp).toHaveBeenCalledTimes(1);
    expect(onCloseHelp).not.toHaveBeenCalled();
  });

  it("calls onCloseHelp when Escape is pressed", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: false })
    );

    fireKeyDown({ key: "Escape" });
    expect(onCloseHelp).toHaveBeenCalledTimes(1);
    expect(onOpenHelp).not.toHaveBeenCalled();
  });

  it("calls focusPrompt when / is pressed", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: false })
    );

    fireKeyDown({ key: "/" });
    expect(focusPrompt).toHaveBeenCalledTimes(1);
  });

  it("does not call focusPrompt when / is pressed while input is focused", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: false })
    );

    const input = document.createElement("input");
    document.body.appendChild(input);
    Object.defineProperty(document, "activeElement", {
      value: input,
      writable: true,
      configurable: true,
    });

    fireKeyDown({ key: "/" });
    expect(focusPrompt).not.toHaveBeenCalled();
  });

  it("calls onPublish when ctrl+s is pressed and hasStory is true", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: true })
    );

    fireKeyDown({ ctrlKey: true, key: "s" });
    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it("does not call onPublish when ctrl+s is pressed and hasStory is false", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: false })
    );

    fireKeyDown({ ctrlKey: true, key: "s" });
    expect(onPublish).not.toHaveBeenCalled();
  });

  it("prevents default browser behavior for registered shortcuts", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: true })
    );

    const event = new KeyboardEvent("keydown", { bubbles: true, shiftKey: true, code: "Slash" });
    const preventDefault = vi.fn();
    Object.defineProperty(event, "preventDefault", { value: preventDefault, configurable: true });

    document.dispatchEvent(event);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("only fires help shortcut with shift key", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: false })
    );

    // "/" alone should not trigger help
    fireKeyDown({ key: "/" });
    expect(onOpenHelp).not.toHaveBeenCalled();
  });

  it("Escape does not trigger onOpenHelp", () => {
    const onOpenHelp = vi.fn();
    const onCloseHelp = vi.fn();
    const focusPrompt = vi.fn();
    const onPublish = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({ onOpenHelp, onCloseHelp, focusPrompt, onPublish, hasStory: false })
    );

    fireKeyDown({ key: "Escape" });
    expect(onOpenHelp).not.toHaveBeenCalled();
  });
});
