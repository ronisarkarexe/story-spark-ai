import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export type ReadingTheme = "light" | "dark" | "sepia";
export type ReadingFontSize = "small" | "medium" | "large";
export type ReadingLineHeight = "compact" | "comfortable" | "spacious";

export interface ReadingPreferences {
  theme: ReadingTheme;
  fontSize: ReadingFontSize;
  lineHeight: ReadingLineHeight;
}

interface ReadingPreferencesContextValue {
  isReadingMode: boolean;
  setIsReadingMode: (active: boolean) => void;
  preferences: ReadingPreferences;
  updatePreference: <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) => void;
  resetPreferences: () => void;
  readingModeClassName: string;
}

const STORAGE_KEY = "story_spark_reading_preferences";

const DEFAULT_PREFERENCES: ReadingPreferences = {
  theme: "light",
  fontSize: "medium",
  lineHeight: "comfortable",
};

const ReadingPreferencesContext = createContext<ReadingPreferencesContextValue | undefined>(undefined);

const loadPreferences = (): ReadingPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(stored);
    return {
      theme: ["light", "dark", "sepia"].includes(parsed.theme) ? parsed.theme : "light",
      fontSize: ["small", "medium", "large"].includes(parsed.fontSize) ? parsed.fontSize : "medium",
      lineHeight: ["compact", "comfortable", "spacious"].includes(parsed.lineHeight) ? parsed.lineHeight : "comfortable",
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const ReadingPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [preferences, setPreferences] = useState<ReadingPreferences>(loadPreferences);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const readingModeClassName = useMemo(() => {
    const themeClasses: Record<ReadingTheme, string> = {
      light: "bg-slate-50 text-slate-900",
      dark: "bg-slate-950 text-slate-100",
      sepia: "bg-[#f4ecd8] text-[#5b4636]",
    };

    const fontSizeClasses: Record<ReadingFontSize, string> = {
      small: "text-base md:text-lg",
      medium: "text-lg md:text-xl",
      large: "text-xl md:text-2xl",
    };

    const lineHeightClasses: Record<ReadingLineHeight, string> = {
      compact: "leading-relaxed",
      comfortable: "leading-loose",
      spacious: "leading-[2.25] md:leading-[2.5]",
    };

    return [
      themeClasses[preferences.theme],
      fontSizeClasses[preferences.fontSize],
      lineHeightClasses[preferences.lineHeight],
    ].join(" ");
  }, [preferences]);

  return (
    <ReadingPreferencesContext.Provider
      value={{
        isReadingMode,
        setIsReadingMode,
        preferences,
        updatePreference,
        resetPreferences,
        readingModeClassName,
      }}
    >
      {children}
    </ReadingPreferencesContext.Provider>
  );
};

export const useReadingPreferences = () => {
  const context = useContext(ReadingPreferencesContext);
  if (!context) {
    throw new Error("useReadingPreferences must be used within ReadingPreferencesProvider");
  }
  return context;
};
