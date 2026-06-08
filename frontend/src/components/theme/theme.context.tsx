import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  glowEnabled: boolean;
  toggleGlow: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const THEME_STORAGE_KEY = "theme";
const GLOW_STORAGE_KEY = "cursorGlow";
const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

// eslint-disable-next-line react-refresh/only-export-components
export const getSystemTheme = (): Theme =>
  window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light";

// eslint-disable-next-line react-refresh/only-export-components
export const getStoredThemePreference = (): Theme | null => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }
  return null;
};

const getInitialTheme = (): Theme =>
  getStoredThemePreference() ?? getSystemTheme();

const getInitialGlow = (): boolean => {
  const storedGlow = localStorage.getItem(GLOW_STORAGE_KEY);
  return storedGlow !== "false";
};

// eslint-disable-next-line react-refresh/only-export-components
export const applyDocumentTheme = (theme: Theme, isExplicit: boolean): void => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light" && isExplicit);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [hasExplicitPreference, setHasExplicitPreference] = useState(
    () => getStoredThemePreference() !== null,
  );
  const [glowEnabled, setGlowEnabled] = useState<boolean>(getInitialGlow);

  useEffect(() => {
    applyDocumentTheme(theme, hasExplicitPreference);

    if (hasExplicitPreference) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } else {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, [theme, hasExplicitPreference]);

  useEffect(() => {
    if (hasExplicitPreference) {
      return;
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [hasExplicitPreference]);

  useEffect(() => {
    localStorage.setItem(GLOW_STORAGE_KEY, glowEnabled ? "true" : "false");
  }, [glowEnabled]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme: () => {
        setHasExplicitPreference(true);
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      },
      glowEnabled,
      toggleGlow: () => setGlowEnabled((prev) => !prev),
    }),
    [theme, glowEnabled],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
