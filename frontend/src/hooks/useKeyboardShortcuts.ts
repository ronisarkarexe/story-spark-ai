import { useEffect, useRef } from "react";

interface ShortcutHandlers {
  onOpenHelp: () => void;
  onCloseHelp: () => void;
  onGenerate: () => void;
  onPublish: () => void;
  focusPrompt: () => void;
  hasStory: boolean;
}

const useKeyboardShortcuts = ({
  onOpenHelp,
  onCloseHelp,
  onGenerate,
  onPublish,
  focusPrompt,
  hasStory,
}: ShortcutHandlers) => {
  const handlersRef = useRef({
    onOpenHelp,
    onCloseHelp,
    onGenerate,
    onPublish,
    focusPrompt,
    hasStory,
  });

  useEffect(() => {
    handlersRef.current = {
      onOpenHelp,
      onCloseHelp,
      onGenerate,
      onPublish,
      focusPrompt,
      hasStory,
    };
  }, [onOpenHelp, onCloseHelp, onGenerate, onPublish, focusPrompt, hasStory]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isTyping =
        active !== null &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);

      // Use e.key ("?") instead of e.code ("Slash") so the shortcut works on
      // non-US layouts (QWERTZ, AZERTY, ...) where ? is on a different key.
      if (e.key === "?") {
        e.preventDefault();
        handlersRef.current.onOpenHelp();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        handlersRef.current.onCloseHelp();
        return;
      }


      if (isTyping) return;

      if (e.key === "/") {
        e.preventDefault();
        handlersRef.current.focusPrompt();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (handlersRef.current.hasStory) {
          handlersRef.current.onPublish();
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);
};

export default useKeyboardShortcuts;