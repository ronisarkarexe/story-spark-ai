import { useEffect, useState } from "react";

const THEME_KEY = "ss_theme";

/** Both themes stay dark — toggles accent atmosphere only (no white flash). */
export type Theme = "midnight" | "aurora";

const isTheme = (value: string | null): value is Theme =>
  value === "midnight" || value === "aurora";

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light") return "aurora";
      if (isTheme(stored)) return stored;
      return "midnight";
    } catch {
      return "midnight";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.remove("theme-midnight", "theme-aurora");
    root.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = () =>
    setTheme((t) => (t === "midnight" ? "aurora" : "midnight"));

  return { theme, toggle, isAurora: theme === "aurora" } as const;
}
