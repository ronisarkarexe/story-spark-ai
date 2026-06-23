import { renderHook, act } from "@testing-library/react";
import useKeyboardShortcuts from "../useKeyboardShortcuts";

const addEventListener = jest.fn();
const removeEventListener = jest.fn();

jest.spyOn(document, "addEventListener").mockImplementation(addEventListener);
jest.spyOn(document, "removeEventListener").mockImplementation(removeEventListener);

jest.spyOn(document, "activeElement", "get").mockReturnValue(null);

describe("useKeyboardShortcuts", () => {
  let onOpenHelp: jest.Mock;
  let onCloseHelp: jest.Mock;
  let onGenerate: jest.Mock;
  let onPublish: jest.Mock;
  let focusPrompt: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    onOpenHelp = jest.fn();
    onCloseHelp = jest.fn();
    onGenerate = jest.fn();
    onPublish = jest.fn();
    focusPrompt = jest.fn();
  });

  const renderHookWithHandlers = (hasStory = true) => {
    return renderHook(() =>
      useKeyboardShortcuts({
        onOpenHelp,
        onCloseHelp,
        onGenerate,
        onPublish,
        focusPrompt,
        hasStory,
      })
    );
  };

  it("registers keydown listener on mount", () => {
    renderHookWithHandlers();
    expect(addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("removes keydown listener on unmount", () => {
    const { unmount } = renderHookWithHandlers();
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  describe("Shift + /", () => {
    it("calls onOpenHelp when Shift+/ is pressed", () => {
      renderHookWithHandlers();
      const handler = addEventListener.mock.calls.find(
        (call) => call[0] === "keydown"
      )?.[1] as (e: KeyboardEvent) => void;

      const event = new KeyboardEvent("keydown", {
        key: "?",
        code: "Slash",
        shiftKey: true,
        bubbles: true,
      });
      handler(event);

      expect(onOpenHelp).toHaveBeenCalled();
    });

    it("does not call other handlers when Shift+/ is pressed", () => {
      renderHookWithHandlers();
      const handler = addEventListener.mock.calls.find(
        (call) => call[0] === "keydown"
      )?.[1] as (e: KeyboardEvent) => void;

      const event = new KeyboardEvent("keydown", {
        key: "?",
        code: "Slash",
        shiftKey: true,
        bubbles: true,
      });
      handler(event);

      expect(onCloseHelp).not.toHaveBeenCalled();
      expect(focusPrompt).not.toHaveBeenCalled();
    });
  });

  describe("Escape", () => {
    it("calls onCloseHelp when Escape is pressed", () => {
      renderHookWithHandlers();
      const handler = addEventListener.mock.calls.find(
        (call) => call[0] === "keydown"
      )?.[1] as (e: KeyboardEvent) => void;

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      handler(event);

      expect(onCloseHelp).toHaveBeenCalled();
    });
  });

  describe("/ (slash focus shortcut)", () => {
    it("calls focusPrompt when / is pressed and not in input", () => {
      renderHookWithHandlers();
      const handler = addEventListener.mock.calls.find(
        (call) => call[0] === "keydown"
      )?.[1] as (e: KeyboardEvent) => void;

      jest.spyOn(document, "activeElement", "get").mockReturnValue(null);

      const event = new KeyboardEvent("keydown", {
        key: "/",
        code: "Slash",
        bubbles: true,
      });
      handler(event);

      expect(focusPrompt).toHaveBeenCalled();
    });

    it("does not call focusPrompt when / is pressed in INPUT", () => {
      renderHookWithHandlers();
      const handler = addEventListener.mock.calls.find(
        (call) => call[0] === "keydown"
      )?.[1] as (e: KeyboardEvent) => void;

      const mockInput = {
        tagName: "INPUT",
        getAttribute: jest.fn(),
      } as unknown as HTMLElement;
      jest.spyOn(document, "activeElement", "get").mockReturnValue(mockInput);

      const event = new KeyboardEvent("keydown", {
        key: "/",
        code: "Slash",
        bubbles: true,
      });
      handler(event);

      expect(focusPrompt).not.toHaveBeenCalled();
    });

    it("does not call focusPrompt when / is pressed in TEXTAREA", () => {
      renderHookWithHandlers();
      const handler = addEventListener.mock.calls.find(
        (call) => call[0] === "keydown"
      )?.[1] as (e: KeyboardEvent) => void;

      const mockTextarea = {
        tagName: "TEXTAREA",
      } as unknown as HTMLElement;
      jest.spyOn(document, "activeElement", "get").mockReturnValue(mockTextarea);

      const event = new KeyboardEvent("keydown", {
        key: "/",
        code: "Slash",
        bubbles: true,
      });
      handler(event);

      expect(focusPrompt).not.toHaveBeenCalled();
    });
  });

  describe("Ctrl+S publish shortcut", () => {
    it("calls onPublish when Ctrl+S is pressed and hasStory is true", () => {
      renderHookWithHandlers(true);
      const handler = addEventListener.mock.calls.find(
        (call) => call[0] === "keydown"
      )?.[1] as (e: KeyboardEvent) => void;

      const event = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: true,
        bubbles: true,
      });
      handler(event);

      expect(onPublish).toHaveBeenCalled();
    });

    it("does not call onPublish when Ctrl+S is pressed and hasStory is false", () => {
      renderHookWithHandlers(false);
      const handler = addEventListener.mock.calls.find(
        (call) => call[0] === "keydown"
      )?.[1] as (e: KeyboardEvent) => void;

      const event = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: true,
        bubbles: true,
      });
      handler(event);

      expect(onPublish).not.toHaveBeenCalled();
    });
  });

  it("updates handlers when props change", () => {
    const { rerender } = renderHook(
      ({ hasStory }: { hasStory: boolean }) =>
        useKeyboardShortcuts({
          onOpenHelp,
          onCloseHelp,
          onGenerate,
          onPublish,
          focusPrompt,
          hasStory,
        }),
      { initialProps: { hasStory: false } }
    );

    const handler = addEventListener.mock.calls.find(
      (call) => call[0] === "keydown"
    )?.[1] as (e: KeyboardEvent) => void;

    rerender({ hasStory: true });

    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      bubbles: true,
    });
    handler(event);

    expect(onPublish).toHaveBeenCalled();
  });
});
