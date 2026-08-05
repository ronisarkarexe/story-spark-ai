// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useKeyboardShortcuts from "../useKeyboardShortcuts";

describe("useKeyboardShortcuts hook", () => {
  const defaultHandlers = {
    onOpenHelp: vi.fn(),
    onCloseHelp: vi.fn(),
    onGenerate: vi.fn(),
    onPublish: vi.fn(),
    focusPrompt: vi.fn(),
    hasStory: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("triggers onOpenHelp on Shift + Slash (Question Mark)", () => {
    renderHook(() => useKeyboardShortcuts(defaultHandlers));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { shiftKey: true, code: "Slash" }));
    });

    expect(defaultHandlers.onOpenHelp).toHaveBeenCalledTimes(1);
  });

  it("triggers onCloseHelp on Escape key", () => {
    renderHook(() => useKeyboardShortcuts(defaultHandlers));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(defaultHandlers.onCloseHelp).toHaveBeenCalledTimes(1);
  });

  it("triggers focusPrompt on Slash key when not typing", () => {
    renderHook(() => useKeyboardShortcuts(defaultHandlers));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    });

    expect(defaultHandlers.focusPrompt).toHaveBeenCalledTimes(1);
  });

  it("triggers onPublish on Ctrl + s when hasStory is true", () => {
    renderHook(() => useKeyboardShortcuts(defaultHandlers));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { ctrlKey: true, key: "s" }));
    });

    expect(defaultHandlers.onPublish).toHaveBeenCalledTimes(1);
  });

  it("does not trigger onPublish on Ctrl + s when hasStory is false", () => {
    renderHook(() => useKeyboardShortcuts({ ...defaultHandlers, hasStory: false }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { ctrlKey: true, key: "s" }));
    });

    expect(defaultHandlers.onPublish).not.toHaveBeenCalled();
  });

  it("removes event listener on unmount", () => {
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => useKeyboardShortcuts(defaultHandlers));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});
