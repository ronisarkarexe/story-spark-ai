import { getFromLocalStorage } from "./local-storage";

export interface WorkspacePreferences {
  aiProvider: "gemini" | "openai";
  defaultGenre: string;
  targetLength: string;
  autoSave: boolean;
  emailNotifications: boolean;
}

export const getSavedWorkspacePreferences = (): WorkspacePreferences => {
  const aiProvider = getFromLocalStorage("pref_aiProvider");
  const defaultGenre = getFromLocalStorage("pref_defaultGenre");
  const targetLength = getFromLocalStorage("pref_targetLength");
  const autoSaveRaw = getFromLocalStorage("pref_autoSave");
  const emailNotificationsRaw = getFromLocalStorage("pref_emailNotifications");

  return {
    aiProvider: (aiProvider === "gemini" || aiProvider === "openai") ? aiProvider : "gemini",
    defaultGenre: defaultGenre || "🧙 Fantasy",
    targetLength: targetLength || "Medium (~600)",
    autoSave: autoSaveRaw !== "" ? autoSaveRaw === "true" : true,
    emailNotifications: emailNotificationsRaw !== "" ? emailNotificationsRaw === "true" : true,
  };
};
