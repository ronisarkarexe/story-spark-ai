import { useState } from "react";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import ReadingPreferencesOnboarding from "../onboarding/ReadingPreferencesOnboarding";

const ReadingPreferencesSettingsSection = () => {
  const { data: profile } = useGetProfileInfoQuery();
  const [isEditing, setIsEditing] = useState(false);

  const preferences = profile?.readingPreferences;

  return (
    <>
      <div className="bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-700/30 rounded-xl p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-indigo-500/30 md:col-span-2">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="fas fa-book-open text-indigo-400"></i> Reading Preferences
          </h2>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-indigo-500/40 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            {preferences?.genres?.length ? "Update Preferences" : "Set Preferences"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Genres
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              {preferences?.genres?.length
                ? preferences.genres.join(", ")
                : "Not set yet"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Story Length
            </p>
            <p className="mt-2 text-sm capitalize text-slate-700 dark:text-slate-200">
              {preferences?.preferredLength || "Not set yet"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Moods
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              {preferences?.moods?.length
                ? preferences.moods.join(", ")
                : "Not set yet"}
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <ReadingPreferencesOnboarding
          mode="settings"
          initialValues={{
            genres: preferences?.genres ?? [],
            preferredLength: preferences?.preferredLength,
            moods: preferences?.moods ?? [],
          }}
          onComplete={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default ReadingPreferencesSettingsSection;
