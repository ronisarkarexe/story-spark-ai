/**
 * @jest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useKeyboardShortcuts from "../useKeyboardShortcuts";

/**
 * Creates a KeyboardEvent-like object. KeyboardEvent properties (ctrlKey,
 * shiftKey, etc.) are read-only getters, so we create a plain object.
 */
const makeKeyboardEvent = (
  overrides: Partial<KeyboardEvent> & { preventDefault?: ReturnType<typeof vi.fn> }
): KeyboardEvent => {
  const defaults: Partial<KeyboardEvent> & { preventDefault?: ReturnType<typeof vi.fn> } = {
    key: "",
    code: "",
    shiftKey: false,
    ctrlKey: false,
    bubbles: true,
    cancelable: true,
    preventDefault: vi.fn(),
  };
  return { ...defaults, ...overrides } as KeyboardEvent;
};

describe("useKeyboardShortcuts", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let onOpenHelp: ReturnType<typeof vi.fn>;
  let onCloseHelp: ReturnType<typeof vi.fn>;
  let onGenerate: ReturnType<typeof vi.fn>;
  let onPublish: ReturnType<typeof vi.fn>;
  let focusPrompt: ReturnType<typeof vi.fn>;
  let currentHook: ReturnType<typeof renderHook> | null = null;

  beforeEach(() => {
    // Reset document.activeElement to null BEFORE each test to ensure test isolation.
    // The hook checks activeElement.tagName to skip shortcuts when the user is typing;
    // a prior test may have set it to INPUT/TEXTAREA and not reset it.
    Object.defineProperty(document, "activeElement", {
      value: null,
      writable: true,
      configurable: true,
    });

    // Capture the real removeEventListener BEFORE spying to avoid infinite recursion.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const realRemove = document.removeEventListener.bind(document) as any;

    addEventListenerSpy = vi.spyOn(document, "addEventListener");
    removeEventListenerSpy = vi.spyOn(document, "removeEventListener").mockImplementation(realRemove);

    onOpenHelp = vi.fn();
    onCloseHelp = vi.fn();
    onGenerate = vi.fn();
    onPublish = vi.fn();
    focusPrompt = vi.fn();
  });

  afterEach(() => {
    if (currentHook) {
      currentHook.unmount();
      currentHook = null;
    }
    vi.restoreAllMocks();
  });

  const getKeydownHandler = (): ((e: KeyboardEvent) => void) | undefined => {
    const keydownCall = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === "keydown"
    );
    return keydownCall?.[1] as ((e: KeyboardEvent) => void) | undefined;
  };

  const renderShortcuts = async (hasStory = true) => {
    currentHook = renderHook(() =>
      useKeyboardShortcuts({
        onOpenHelp,
        onCloseHelp,
        onGenerate,
        onPublish,
        focusPrompt,
        hasStory,
      })
    );
    // Flush effects so the keydown handler is registered before we return.
    await new Promise((resolve) => setTimeout(resolve, 0));
    return currentHook;
  };

  it("registers keydown event listener on mount", async () => {
    const { unmount } = await renderShortcuts();
    expect(getKeydownHandler()).toBeDefined();
    unmount();
    currentHook = null;
  });

  it("removes keydown event listener on unmount", async () => {
    const { unmount } = await renderShortcuts();
    const handler = getKeydownHandler();
    unmount();
    currentHook = null;
    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", handler);
  });

  describe("? shortcut", () => {
    it("calls onOpenHelp and prevents default", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const event = makeKeyboardEvent({
        shiftKey: true,
        code: "Slash",
        key: "?",
      });

      handler!(event);
      expect(onOpenHelp).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
      unmount();
      currentHook = null;
    });

    it("works on non-US layouts where ? is on a different physical key", async () => {
      // On German QWERTZ, "?" is Shift+"/" which is the "Slash" key, but on
      // other layouts (e.g. some AZERTY) the "?" character maps to a different
      // e.code. The shortcut must fire on e.key === "?", not on e.code.
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const event = makeKeyboardEvent({
        shiftKey: true,
        code: "IntlBackslash", // not "Slash"
        key: "?",
      });

      handler!(event);
      expect(onOpenHelp).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
      unmount();
      currentHook = null;
    });

    it("does not trigger on plain / without shift producing ?", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const event = makeKeyboardEvent({
        shiftKey: false,
        code: "Slash",
        key: "/",
      });

      handler!(event);
      expect(onOpenHelp).not.toHaveBeenCalled();
      unmount();
      currentHook = null;
    });
  });

  describe("Escape shortcut", () => {
    it("calls onCloseHelp and prevents default", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const event = makeKeyboardEvent({
        key: "Escape",
        code: "Escape",
      });

      handler!(event);
      expect(onCloseHelp).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
      unmount();
      currentHook = null;
    });
  });

  describe("/ shortcut", () => {
    it("calls focusPrompt and prevents default when not in input", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      // activeElement is null by default (set in beforeEach) — skip typing guard.

      const event = makeKeyboardEvent({
        key: "/",
        code: "Slash",
        shiftKey: false,
      });

      handler!(event);
      expect(focusPrompt).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
      unmount();
      currentHook = null;
    });

    it("does not call focusPrompt when focus is on INPUT", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const input = document.createElement("input");
      Object.defineProperty(document, "activeElement", {
        value: input,
        writable: true,
        configurable: true,
      });

      const event = makeKeyboardEvent({
        key: "/",
        code: "Slash",
        shiftKey: false,
      });

      handler!(event);
      expect(focusPrompt).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
      unmount();
      currentHook = null;
    });

    it("does not call focusPrompt when focus is on TEXTAREA", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const textarea = document.createElement("textarea");
      Object.defineProperty(document, "activeElement", {
        value: textarea,
        writable: true,
        configurable: true,
      });

      const event = makeKeyboardEvent({
        key: "/",
        code: "Slash",
        shiftKey: false,
      });

      handler!(event);
      expect(focusPrompt).not.toHaveBeenCalled();
      unmount();
      currentHook = null;
    });
  });

  describe("ctrl+Enter shortcut", () => {
    it("calls onGenerate and prevents default when not typing", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const event = makeKeyboardEvent({
        ctrlKey: true,
        key: "Enter",
        code: "Enter",
      });

      handler!(event);
      expect(onGenerate).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
      unmount();
      currentHook = null;
    });

    it("does not call onGenerate when focus is on TEXTAREA", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const textarea = document.createElement("textarea");
      Object.defineProperty(document, "activeElement", {
        value: textarea,
        writable: true,
        configurable: true,
      });

      const event = makeKeyboardEvent({
        ctrlKey: true,
        key: "Enter",
        code: "Enter",
      });

      handler!(event);
      expect(onGenerate).not.toHaveBeenCalled();
      unmount();
      currentHook = null;
    });

    it("does not call onGenerate on plain Enter without ctrl", async () => {
      const { unmount } = await renderShortcuts();
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const event = makeKeyboardEvent({
        ctrlKey: false,
        key: "Enter",
        code: "Enter",
      });

      handler!(event);
      expect(onGenerate).not.toHaveBeenCalled();
      unmount();
      currentHook = null;
    });
  });

  describe("ctrl+s shortcut", () => {
    it("calls onPublish and prevents default when hasStory is true", async () => {
      const { unmount } = await renderShortcuts(true);
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const event = makeKeyboardEvent({
        ctrlKey: true,
        key: "s",
        code: "KeyS",
      });

      handler!(event);
      expect(onPublish).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
      unmount();
      currentHook = null;
    });

    it("does not call onPublish when hasStory is false", async () => {
      const { unmount } = await renderShortcuts(false);
      const handler = getKeydownHandler();
      expect(handler).toBeDefined();

      const event = makeKeyboardEvent({
        ctrlKey: true,
        key: "s",
        code: "KeyS",
      });

      handler!(event);
      expect(onPublish).not.toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      unmount();
      currentHook = null;
    });
  });
});
