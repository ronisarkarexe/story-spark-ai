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

const getInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return "light";
};

const getInitialGlow = (): boolean => {
  const storedGlow = localStorage.getItem("cursorGlow");
  return storedGlow !== "false";
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [glowEnabled, setGlowEnabled] = useState<boolean>(getInitialGlow);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cursorGlow", glowEnabled ? "true" : "false");
  }, [glowEnabled]);

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
