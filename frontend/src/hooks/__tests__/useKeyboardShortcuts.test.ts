/* eslint-disable */
/**
 * useKeyboardShortcuts.test.ts
 * Unit tests for the useKeyboardShortcuts React hook.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useKeyboardShortcuts from "../useKeyboardShortcuts";

const createKeyboardEvent = (
  key: string,
  options: Partial<KeyboardEventInit> = {}
) => new KeyboardEvent("keydown", { key, bubbles: true, ...options });

describe("useKeyboardShortcuts", () => {
  beforeEach(() => {
    // Clear active element between tests
    document.activeElement &&
      (document.activeElement as HTMLElement).blur &&
      ((document.activeElement as HTMLElement).blur());
  });

  const renderHookWithHandlers = (overrides: Partial<Parameters<typeof useKeyboardShortcuts>[0]> = {}) => {
    const handlers = {
      onOpenHelp: vi.fn(),
      onCloseHelp: vi.fn(),
      onGenerate: vi.fn(),
      onPublish: vi.fn(),
      focusPrompt: vi.fn(),
      hasStory: true,
      ...overrides,
    };
    const utils = renderHook(() => useKeyboardShortcuts(handlers));
    return { utils, handlers };
  };

  it("registers keydown listener on mount", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");
    const { utils } = renderHookWithHandlers();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );

    utils.utils.unmount();
  });

  it("removes keydown listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
    const { utils } = renderHookWithHandlers();

    utils.utils.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("Shift+/ triggers onOpenHelp", () => {
    const { handlers } = renderHookWithHandlers();

    document.dispatchEvent(createKeyboardEvent("/", { shiftKey: true }));

    expect(handlers.onOpenHelp).toHaveBeenCalledTimes(1);
    expect(handlers.onCloseHelp).not.toHaveBeenCalled();
  });

  it("Escape triggers onCloseHelp", () => {
    const { handlers } = renderHookWithHandlers();

    document.dispatchEvent(createKeyboardEvent("Escape"));

    expect(handlers.onCloseHelp).toHaveBeenCalledTimes(1);
  });

  it("/ (without shift) when not typing triggers focusPrompt", () => {
    const { handlers } = renderHookWithHandlers();

    document.dispatchEvent(createKeyboardEvent("/"));

    expect(handlers.focusPrompt).toHaveBeenCalledTimes(1);
  });

  it("/ does NOT trigger shortcuts when user is typing in INPUT", () => {
    const { handlers } = renderHookWithHandlers();

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    document.dispatchEvent(createKeyboardEvent("/"));

    expect(handlers.focusPrompt).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it("/ does NOT trigger shortcuts when user is typing in TEXTAREA", () => {
    const { handlers } = renderHookWithHandlers();

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();

    document.dispatchEvent(createKeyboardEvent("/"));

    expect(handlers.focusPrompt).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it("/ does NOT trigger shortcuts when user is typing in SELECT", () => {
    const { handlers } = renderHookWithHandlers();

    const select = document.createElement("select");
    document.body.appendChild(select);
    select.focus();

    document.dispatchEvent(createKeyboardEvent("/"));

    expect(handlers.focusPrompt).not.toHaveBeenCalled();

    document.body.removeChild(select);
  });

  it("Ctrl+S triggers onPublish when hasStory is true and not typing", () => {
    const { handlers } = renderHookWithHandlers({ hasStory: true });

    document.dispatchEvent(createKeyboardEvent("s", { ctrlKey: true }));

    expect(handlers.onPublish).toHaveBeenCalledTimes(1);
  });

  it("Ctrl+S does NOT trigger onPublish when hasStory is false", () => {
    const { handlers } = renderHookWithHandlers({ hasStory: false });

    document.dispatchEvent(createKeyboardEvent("s", { ctrlKey: true }));

    expect(handlers.onPublish).not.toHaveBeenCalled();
  });

  it("Ctrl+S does NOT trigger onPublish when user is typing in input", () => {
    const { handlers } = renderHookWithHandlers({ hasStory: true });

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    document.dispatchEvent(createKeyboardEvent("s", { ctrlKey: true }));

    expect(handlers.onPublish).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it("Escape does NOT check typing guard - closes help even when typing", () => {
    const { handlers } = renderHookWithHandlers();

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    document.dispatchEvent(createKeyboardEvent("Escape"));

    // Escape works regardless of typing state (has its own preventDefault check)
    expect(handlers.onCloseHelp).toHaveBeenCalledTimes(1);

    document.body.removeChild(input);
  });

  it("does not call any handler for unrelated keys", () => {
    const { handlers } = renderHookWithHandlers();

    document.dispatchEvent(createKeyboardEvent("a"));
    document.dispatchEvent(createKeyboardEvent("Enter"));
    document.dispatchEvent(createKeyboardEvent("Tab"));

    expect(handlers.onOpenHelp).not.toHaveBeenCalled();
    expect(handlers.onCloseHelp).not.toHaveBeenCalled();
    expect(handlers.focusPrompt).not.toHaveBeenCalled();
    expect(handlers.onPublish).not.toHaveBeenCalled();
  });

  it("handler refs are updated when props change", () => {
    const { utils, handlers } = renderHookWithHandlers();

    // Initial call
    document.dispatchEvent(createKeyboardEvent("s", { ctrlKey: true }));
    expect(handlers.onPublish).toHaveBeenCalledTimes(1);

    // Update hasStory to false
    const onPublish2 = vi.fn();
    utils.utils.rerender({
      onOpenHelp: handlers.onOpenHelp,
      onCloseHelp: handlers.onCloseHelp,
      onGenerate: handlers.onGenerate,
      onPublish: onPublish2,
      focusPrompt: handlers.focusPrompt,
      hasStory: false,
    });

    document.dispatchEvent(createKeyboardEvent("s", { ctrlKey: true }));
    expect(onPublish2).not.toHaveBeenCalled();
  });
});
