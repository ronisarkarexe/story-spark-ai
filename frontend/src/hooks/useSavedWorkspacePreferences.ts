import { useState, useEffect } from "react";
import { getSavedWorkspacePreferences, WorkspacePreferences } from "../utils/preferences";

export const useSavedWorkspacePreferences = (): WorkspacePreferences => {
  const [preferences, setPreferences] = useState<WorkspacePreferences>(getSavedWorkspacePreferences());

  useEffect(() => {
    // Initial fetch
    setPreferences(getSavedWorkspacePreferences());

    // Listen to storage changes to keep settings synchronized across tabs / updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("pref_")) {
        setPreferences(getSavedWorkspacePreferences());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return preferences;
};
