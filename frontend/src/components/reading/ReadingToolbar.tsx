import React, { useState } from "react";
import { useReadingPreferences } from "../../context/ReadingPreferencesContext";
import ReadingSettings from "./ReadingSettings";

interface ReadingToolbarProps {
  storyTitle: string;
  readingTimeText: string;
  onExit: () => void;
}

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
  storyTitle,
  readingTimeText,
  onExit,
}) => {
  const { preferences } = useReadingPreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const borderThemeClasses = {
    light: "border-slate-200 bg-white/80 backdrop-blur-md",
    dark: "border-slate-800 bg-slate-950/85 backdrop-blur-md",
    sepia: "border-[#e7dac2] bg-[#f4ecd8]/90 backdrop-blur-md",
  };

  const textSecondaryClasses = {
    light: "text-slate-500",
    dark: "text-slate-400",
    sepia: "text-[#8a7255]",
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 border-b transition-colors duration-300 ${
        borderThemeClasses[preferences.theme]
      }`}
    >
      <button
        onClick={onExit}
        className="flex items-center gap-2 text-sm font-semibold hover:opacity-85 transition cursor-pointer select-none"
        aria-label="Exit Reading Mode"
      >
        <span className="text-lg">←</span> Exit
      </button>

      <div className="hidden md:flex flex-col items-center max-w-xl text-center">
        <h2 className="font-bold text-sm truncate w-full max-w-[300px] lg:max-w-[450px]">
          {storyTitle}
        </h2>
        <span className={`text-[11px] font-medium ${textSecondaryClasses[preferences.theme]}`}>
          {readingTimeText}
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
          aria-label="Display Preferences"
        >
          <span className="text-lg">⚙️</span> Display
        </button>

        <ReadingSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </header>
  );
};

export default ReadingToolbar;
