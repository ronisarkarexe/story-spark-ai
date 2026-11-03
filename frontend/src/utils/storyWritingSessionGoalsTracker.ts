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

  const wordProgress = Math.min(
    (wordCount / goals.targetWords) * 100,
    100
  );

  const timeProgress = Math.min(
    (minutes / goals.targetMinutes) * 100,
    100
  );

  const chapterProgress = Math.min(
    (chapterCount / goals.targetChapters) * 100,
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