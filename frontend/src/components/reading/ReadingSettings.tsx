import React, { useRef, useEffect } from "react";
import { useReadingPreferences, ReadingTheme, ReadingFontSize, ReadingLineHeight } from "../../context/ReadingPreferencesContext";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadingSettings: React.FC<ReadingSettingsProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreference, resetPreferences } = useReadingPreferences();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const themes: Array<{ value: ReadingTheme; label: string; bg: string; text: string; border: string }> = [
    { value: "light", label: "Light", bg: "bg-white", text: "text-slate-900", border: "border-slate-200" },
    { value: "dark", label: "Dark", bg: "bg-slate-950", text: "text-slate-100", border: "border-slate-800" },
    { value: "sepia", label: "Sepia", bg: "bg-[#f4ecd8]", text: "text-[#5b4636]", border: "border-[#e7dac2]" },
  ];

  const fontSizes: Array<{ value: ReadingFontSize; label: string }> = [
    { value: "small", label: "A-" },
    { value: "medium", label: "A" },
    { value: "large", label: "A+" },
  ];

  const lineHeights: Array<{ value: ReadingLineHeight; label: string }> = [
    { value: "compact", label: "Compact" },
    { value: "comfortable", label: "Comfortable" },
    { value: "spacious", label: "Spacious" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 text-slate-900 dark:text-slate-100"
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Reading Display
            </h4>
            <button
              onClick={resetPreferences}
              className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-650 dark:hover:text-indigo-400 cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* Theme Group */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">THEME</span>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((theme) => {
                  const isActive = preferences.theme === theme.value;
                  return (
                    <button
                      key={theme.value}
                      onClick={() => updatePreference("theme", theme.value)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${theme.bg} ${theme.text} ${theme.border} ${
                        isActive
                          ? "ring-2 ring-indigo-500 border-transparent scale-105"
                          : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      {theme.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size Group */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">FONT SIZE</span>
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg">
                {fontSizes.map((size) => {
                  const isActive = preferences.fontSize === size.value;
                  return (
                    <button
                      key={size.value}
                      onClick={() => updatePreference("fontSize", size.value)}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                        isActive
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
                      }`}
                    >
                      {size.label} ({size.value})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spacing Group */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">LINE HEIGHT</span>
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg">
                {lineHeights.map((spacing) => {
                  const isActive = preferences.lineHeight === spacing.value;
                  return (
                    <button
                      key={spacing.value}
                      onClick={() => updatePreference("lineHeight", spacing.value)}
                      className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${
                        isActive
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
                      }`}
                    >
                      {spacing.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ReadingSettings;
