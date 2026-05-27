import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme.context";

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      className="rounded-full p-2 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-all duration-300 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-all duration-300" />
      ) : (
        <Moon className="h-4 w-4 transition-all duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
