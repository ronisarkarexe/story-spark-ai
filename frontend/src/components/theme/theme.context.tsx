import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

export type CursorStyle = "off" | "sparkle" | "glow-orb" | "trail";

// eslint-disable-next-line react-refresh/only-export-components
export const CURSOR_STYLES: { value: CursorStyle; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "sparkle", label: "Sparkle" },
  { value: "glow-orb", label: "Glow Orb" },
  { value: "trail", label: "Trail" },
];

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  cursorStyle: CursorStyle;
  setCursorStyle: (style: CursorStyle) => void;
  /** @deprecated use cursorStyle instead. Kept for backward compatibility. */
  glowEnabled: boolean;
  /** @deprecated use setCursorStyle instead. Toggles between "off" and "sparkle". */
  toggleGlow: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const VALID_CURSOR_STYLES: CursorStyle[] = ["off", "sparkle", "glow-orb", "trail"];

const getInitialCursorStyle = (): CursorStyle => {
  if (typeof window === "undefined") {
    return "sparkle";
  }

  const stored = localStorage.getItem("cursorStyle");
  if (stored && VALID_CURSOR_STYLES.includes(stored as CursorStyle)) {
    return stored as CursorStyle;
  }

  // Migrate from the legacy boolean flag if present.
  const legacyGlow = localStorage.getItem("cursorGlow");
  if (legacyGlow === "false") {
    return "off";
  }

  return "sparkle";
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>(getInitialCursorStyle);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cursorStyle", cursorStyle);
    // Keep the legacy key in sync for any external code still reading it.
    localStorage.setItem("cursorGlow", cursorStyle === "off" ? "false" : "true");
  }, [cursorStyle]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      cursorStyle,
      setCursorStyle,
      glowEnabled: cursorStyle !== "off",
      toggleGlow: () => setCursorStyle((prev) => (prev === "off" ? "sparkle" : "off")),
    }),
    [theme, cursorStyle],
  );

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
