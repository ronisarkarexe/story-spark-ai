import { useEffect, useMemo, useState } from "react";

type FontSize = "small" | "medium" | "large";
type LineSpacing = "compact" | "comfortable" | "spacious";
type ReadingWidth = "narrow" | "default" | "wide";
type FontStyle = "default" | "serif" | "dyslexia";

export type ReaderPreferences = {
  fontSize: FontSize;
  lineSpacing: LineSpacing;
  readingWidth: ReadingWidth;
  fontStyle: FontStyle;
};

const STORAGE_KEY = "story_spark_reader_preferences";

const DEFAULT_PREFERENCES: ReaderPreferences = {
  fontSize: "medium",
  lineSpacing: "comfortable",
  readingWidth: "default",
  fontStyle: "default",
};

const isReaderPreferences = (value: unknown): value is ReaderPreferences => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ReaderPreferences>;

  return (
    ["small", "medium", "large"].includes(candidate.fontSize ?? "") &&
    ["compact", "comfortable", "spacious"].includes(candidate.lineSpacing ?? "") &&
    ["narrow", "default", "wide"].includes(candidate.readingWidth ?? "") &&
    ["default", "serif", "dyslexia"].includes(candidate.fontStyle ?? "")
  );
};

const loadPreferences = (): ReaderPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored);
    return isReaderPreferences(parsed) ? parsed : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const useReaderPreferences = () => {
  const [preferences, setPreferences] =
    useState<ReaderPreferences>(loadPreferences);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const readerClassName = useMemo(() => {
    const fontSizeClasses: Record<FontSize, string> = {
      small: "text-base",
      medium: "text-lg",
      large: "text-xl",
    };

    const lineSpacingClasses: Record<LineSpacing, string> = {
      compact: "leading-7",
      comfortable: "leading-8",
      spacious: "leading-10",
    };

    const widthClasses: Record<ReadingWidth, string> = {
      narrow: "max-w-2xl",
      default: "max-w-3xl",
      wide: "max-w-5xl",
    };

    const fontStyleClasses: Record<FontStyle, string> = {
      default: "font-sans",
      serif: "font-serif",
      dyslexia: "font-sans tracking-wide",
    };

    return [
      widthClasses[preferences.readingWidth],
      fontSizeClasses[preferences.fontSize],
      lineSpacingClasses[preferences.lineSpacing],
      fontStyleClasses[preferences.fontStyle],
    ].join(" ");
  }, [preferences]);

  const updatePreference = <Key extends keyof ReaderPreferences>(
    key: Key,
    value: ReaderPreferences[Key]
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    readerClassName,
    updatePreference,
    resetPreferences,
  };
};
