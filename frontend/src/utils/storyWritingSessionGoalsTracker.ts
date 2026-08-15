export interface WritingGoals {
  targetWords: number;
  targetMinutes: number;
  targetChapters: number;
}

export interface SessionProgress {
  currentWords: number;
  currentMinutes: number;
  completedChapters: number;
  wordProgress: number;
  timeProgress: number;
  chapterProgress: number;
  milestone: string;
}

export interface SessionHistory {
  id: number;
  date: string;
  wordsWritten: number;
  duration: number;
  completedGoals: number;
}

export function calculateSessionProgress(
  story: string,
  goals: WritingGoals,
  startTime: number
): SessionProgress {
  const wordCount = story
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const chapterCount = story
    .split(/\n{2,}/)
    .filter(Boolean).length;

  const minutes = Math.floor(
    (Date.now() - startTime) / 60000
  );

  // Guard zero/NaN targets: when a goal is unset (0) or invalid (NaN),
  // the corresponding progress is undefined (NaN/Infinity) and pollutes the
  // UI. Treat such targets as "no goal" → 0 progress.
  const safeTarget = (target: number): number =>
    Number.isFinite(target) && target > 0 ? target : 0;

  const wordTarget = safeTarget(goals.targetWords);
  const timeTarget = safeTarget(goals.targetMinutes);
  const chapterTarget = safeTarget(goals.targetChapters);

  const wordProgress = Math.min(
    wordTarget > 0 ? (wordCount / wordTarget) * 100 : 0,
    100
  );

  const timeProgress = Math.min(
    timeTarget > 0 ? (minutes / timeTarget) * 100 : 0,
    100
  );

  const chapterProgress = Math.min(
    chapterTarget > 0 ? (chapterCount / chapterTarget) * 100 : 0,
    100
  );

  let milestone = "Keep Writing!";

  if (wordProgress >= 100) {
    milestone = "🎉 Word Goal Completed!";
  } else if (wordProgress >= 75) {
    milestone = "🔥 Almost There!";
  } else if (wordProgress >= 50) {
    milestone = "💪 Halfway Done!";
  }

  return {
    currentWords: wordCount,
    currentMinutes: minutes,
    completedChapters: chapterCount,
    wordProgress,
    timeProgress,
    chapterProgress,
    milestone,
  };
}

export function getSessionHistory(): SessionHistory[] {
  try {
    return JSON.parse(
      localStorage.getItem("writing-session-history") || "[]"
    ) as SessionHistory[];
  } catch {
    return [];
  }
}

export function saveSessionHistory(
  history: SessionHistory[]
) {
  localStorage.setItem(
    "writing-session-history",
    JSON.stringify(history)
  );
}