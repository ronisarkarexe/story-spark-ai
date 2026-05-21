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
    console.log("keyboard hook mounted");

    const handler = (e: KeyboardEvent) => {
      console.log("KEY:", e.key, "CODE:", e.code, "SHIFT:", e.shiftKey);

      const active = document.activeElement;

      const isTyping =
        active !== null &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);

      if (e.shiftKey && e.code === "Slash") {
        console.log("OPEN HELP");
        e.preventDefault();
        onOpenHelp();
        return;
      }

      if (e.key === "Escape") {
        console.log("ESC");
        e.preventDefault();
        onCloseHelp();
        return;
      }

      if (isTyping) return;

      if (e.key === "/") {
        console.log("FOCUS");
        e.preventDefault();
        focusPrompt();
        return;
      }

      if (e.ctrlKey && e.key === "Enter") {
        console.log("GENERATE");
        e.preventDefault();
        onGenerate();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        console.log("SAVE");
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