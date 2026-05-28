import { useEffect } from "react";

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
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isTyping =
        active !== null &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);

      if (e.shiftKey && e.code === "Slash") {
        e.preventDefault();
        onOpenHelp();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onCloseHelp();
        return;
      }

      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        onGenerate();
        return;
      }

      if (isTyping) return;

      if (e.key === "/") {
        e.preventDefault();
        focusPrompt();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (hasStory) {
          onPublish();
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [onOpenHelp, onCloseHelp, onGenerate, onPublish, focusPrompt, hasStory]);
};

export default useKeyboardShortcuts;