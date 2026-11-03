export interface FocusModeSettings {
  enabled: boolean;
  fontSize: number;
  lineSpacing: number;
  contentWidth: number;
  theme: "light" | "dark";
}

const STORAGE_KEY = "story-focus-mode-settings";

export const defaultSettings: FocusModeSettings = {
  enabled: false,
  fontSize: 18,
  lineSpacing: 1.8,
  contentWidth: 700,
  theme: "dark",
};

export function loadFocusModeSettings(): FocusModeSettings {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return defaultSettings;

  try {
    return JSON.parse(saved);
  } catch {
    return defaultSettings;
  }
}

export function saveFocusModeSettings(
  settings: FocusModeSettings
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  );
}

export function toggleFocusMode(
  settings: FocusModeSettings
): FocusModeSettings {
  const updated = {
    ...settings,
    enabled: !settings.enabled,
  };

  saveFocusModeSettings(updated);

  return updated;
}