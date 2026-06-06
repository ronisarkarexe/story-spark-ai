import {
  type ReaderPreferences,
  useReaderPreferences,
} from "./useReaderPreferences";

const preferenceGroups = [
  {
    key: "fontSize",
    label: "Font size",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
  },
  {
    key: "lineSpacing",
    label: "Line spacing",
    options: [
      { value: "compact", label: "Compact" },
      { value: "comfortable", label: "Comfortable" },
      { value: "spacious", label: "Spacious" },
    ],
  },
  {
    key: "readingWidth",
    label: "Reading width",
    options: [
      { value: "narrow", label: "Narrow" },
      { value: "default", label: "Default" },
      { value: "wide", label: "Wide" },
    ],
  },
  {
    key: "fontStyle",
    label: "Font style",
    options: [
      { value: "default", label: "Default" },
      { value: "serif", label: "Serif" },
      { value: "dyslexia", label: "Dyslexia-friendly" },
    ],
  },
] as const;

type ReaderPreferencesPanelProps = ReturnType<typeof useReaderPreferences> & {
  className?: string;
};

const ReaderPreferencesPanel = ({
  preferences,
  updatePreference,
  resetPreferences,
  className = "",
}: ReaderPreferencesPanelProps) => {
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white/90 p-4 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 ${className}`}
      aria-label="Reader preferences"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            Reader Preferences
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tune story text for comfortable reading.
          </p>
        </div>
        <button
          type="button"
          onClick={resetPreferences}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {preferenceGroups.map((group) => (
          <div key={group.key}>
            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const isActive = preferences[group.key] === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() =>
                      updatePreference(
                        group.key,
                        option.value as ReaderPreferences[typeof group.key]
                      )
                    }
                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReaderPreferencesPanel;
