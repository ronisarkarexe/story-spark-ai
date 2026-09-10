export interface WritingMilestone {
  totalWords: number;
  completedChapters: number;
  totalChapters: number;
  completionPercentage: number;
  editingProgress: number;
}

export function calculateWritingMilestones(
  story: string,
  chapterCount: number
): WritingMilestone {
  const words = story
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const targetWords = 5000;

  const completionPercentage = Math.min(
    Math.round((words / targetWords) * 100),
    100
  );

  const editingProgress = Math.min(
    Math.round((completionPercentage + chapterCount * 5) / 2),
    100
  );

  return {
    totalWords: words,
    completedChapters: chapterCount,
    totalChapters: Math.max(chapterCount, 10),
    completionPercentage,
    editingProgress,
  };
}