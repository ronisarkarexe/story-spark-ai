import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  glowEnabled: boolean;
  toggleGlow: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with standard safe defaults to prevent server-side hydration crashes
  const [theme, setTheme] = useState<Theme>("light");
  const [glowEnabled, setGlowEnabled] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Read preferences safely ONLY once mounted on the client browser
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    const storedGlow = localStorage.getItem("cursorGlow");
    if (storedGlow === "false") {
      setGlowEnabled(false);
    }

    setMounted(true);
  }, []);

  // Update DOM attributes and persist changes whenever states shift
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("cursorGlow", glowEnabled ? "true" : "false");
  }, [glowEnabled, mounted]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      glowEnabled,
      toggleGlow: () => setGlowEnabled((prev) => !prev),
    }),
    [theme, glowEnabled],
  );

  // Prevent UI flashing/mismatches during hydration phase
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};