import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  PREFERRED_LENGTH_OPTIONS,
  READING_GENRES,
  READING_MOODS,
  PreferredLength,
  ReadingPreferencesPayload,
} from "../../constants/readingPreferences";
import { useUpdateReadingPreferencesMutation } from "../../redux/apis/user.api";
import { trackOnboardingEvent } from "../../utils/onboardingAnalytics";

type ReadingPreferencesOnboardingProps = {
  onComplete: () => void;
  initialValues?: Partial<ReadingPreferencesPayload>;
  mode?: "onboarding" | "settings";
};

const TOTAL_STEPS = 3;

const toggleSelection = (
  current: string[],
  value: string,
  maxItems = 10
) => {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  if (current.length >= maxItems) {
    return current;
  }

  return [...current, value];
};

const ReadingPreferencesOnboarding = ({
  onComplete,
  initialValues,
  mode = "onboarding",
}: ReadingPreferencesOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [genres, setGenres] = useState<string[]>(initialValues?.genres ?? []);
  const [preferredLength, setPreferredLength] = useState<PreferredLength | "">(
    initialValues?.preferredLength ?? ""
  );
  const [moods, setMoods] = useState<string[]>(initialValues?.moods ?? []);
  const [isFinished, setIsFinished] = useState(false);
  const [updateReadingPreferences, { isLoading }] =
    useUpdateReadingPreferencesMutation();

  useEffect(() => {
    if (mode === "onboarding") {
      trackOnboardingEvent("onboarding_started");
    }
  }, [mode]);

  const stepTitle = useMemo(() => {
    if (isFinished) {
      return "You're all set!";
    }

    if (step === 1) {
      return "What stories do you enjoy reading?";
    }

    if (step === 2) {
      return "How long do you usually like your stories?";
    }

    return "What kind of stories match your mood?";
  }, [isFinished, step]);

  const canContinue = () => {
    if (step === 1) {
      return genres.length >= 1;
    }

    if (step === 2) {
      return preferredLength !== "";
    }

    return moods.length >= 1;
  };

  const handleNext = () => {
    if (!canContinue()) {
      return;
    }

    if (step === 1) {
      trackOnboardingEvent("genre_step_completed", { count: genres.length });
      setStep(2);
      return;
    }

    if (step === 2) {
      trackOnboardingEvent("length_step_completed", { preferredLength });
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const handleFinish = async () => {
    if (!preferredLength || moods.length === 0 || genres.length === 0) {
      return;
    }

    try {
      await updateReadingPreferences({
        genres,
        preferredLength,
        moods,
      }).unwrap();

      trackOnboardingEvent("mood_step_completed", { count: moods.length });
      trackOnboardingEvent("onboarding_completed");

      if (mode === "onboarding") {
        setIsFinished(true);
        window.setTimeout(onComplete, 1800);
        return;
      }

      toast.success("Reading preferences updated successfully!");
      onComplete();
    } catch {
      toast.error("Unable to save your preferences. Please try again.");
    }
  };

  const handleSkip = async () => {
    try {
      await updateReadingPreferences({ skip: true }).unwrap();
      trackOnboardingEvent("onboarding_skipped");
      onComplete();
    } catch {
      toast.error("Unable to skip onboarding right now. Please try again.");
    }
  };

  const chipClass = (isActive: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-600/20 dark:text-indigo-200"
        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    }`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-8"
      >
        {!isFinished && mode === "onboarding" && (
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-500">
                Step {step} of {TOTAL_STEPS}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 w-2.5 rounded-full ${
                      index + 1 <= step
                        ? "bg-indigo-500"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              className="text-sm font-medium text-slate-500 transition hover:text-indigo-500 dark:text-slate-400"
            >
              Skip for now
            </button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {stepTitle}
          </h2>
          {!isFinished && step === 1 && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Pick at least one genre. Most readers choose 3–5.
            </p>
          )}
          {isFinished && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              We&apos;re personalizing your recommendations.
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!isFinished && step === 1 && (
            <motion.div
              key="genres"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex flex-wrap gap-3"
            >
              {READING_GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setGenres((current) => toggleSelection(current, genre))}
                  className={chipClass(genres.includes(genre))}
                >
                  {genre}
                </button>
              ))}
            </motion.div>
          )}

          {!isFinished && step === 2 && (
            <motion.div
              key="length"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="grid gap-3 sm:grid-cols-3"
            >
              {PREFERRED_LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreferredLength(option.value)}
                  className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                    preferredLength === option.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-600/20"
                      : "border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900"
                  }`}
                >
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {option.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {option.description}
                  </p>
                </button>
              ))}
            </motion.div>
          )}

          {!isFinished && step === 3 && (
            <motion.div
              key="moods"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex flex-wrap gap-3"
            >
              {READING_MOODS.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setMoods((current) => toggleSelection(current, mood))}
                  className={chipClass(moods.includes(mood))}
                >
                  {mood}
                </button>
              ))}
            </motion.div>
          )}

          {isFinished && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10"
            >
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                Preferences saved
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!isFinished && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || isLoading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300"
            >
              Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canContinue() || isLoading}
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-indigo-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={!canContinue() || isLoading}
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-indigo-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Saving..." : mode === "settings" ? "Save Preferences" : "Finish"}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReadingPreferencesOnboarding;
