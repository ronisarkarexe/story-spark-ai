import { useState, useEffect } from "react";

export const getSavedWorkspacePreferences = () => {
  if (typeof window === "undefined") {
    return {
      aiProvider: "gemini",
      defaultGenre: "Drama",
      targetLength: "Medium (~600)",
      autoSave: true,
    };
  }
  return {
    aiProvider: localStorage.getItem("pref_aiProvider") || "gemini",
    defaultGenre: localStorage.getItem("pref_defaultGenre") || "Drama",
    targetLength: localStorage.getItem("pref_targetLength") || "Medium (~600)",
    autoSave: localStorage.getItem("pref_autoSave") !== "false",
  };
};

const useWorkspacePreferences = () => {
  const [preferences, setPreferences] = useState(getSavedWorkspacePreferences);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleStorageChange = () => {
      setPreferences(getSavedWorkspacePreferences());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return preferences;
};

export default useWorkspacePreferences;
