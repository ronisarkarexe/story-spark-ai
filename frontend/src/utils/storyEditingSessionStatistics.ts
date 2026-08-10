export interface EditingSessionStats {
  wordsAdded: number;
  wordsRemoved: number;
 paragraphsModified: number;
  editingDuration: number;
  totalRevisions: number;
}

export interface EditingSessionHistory {
  id: number;
  date: string;
  duration: number;
  revisions: number;
}

export function calculateEditingSession(
  previousStory: string,
  currentStory: string,
  startTime: number
): EditingSessionStats {
  const previousWords = previousStory.trim().split(/\s+/).filter(Boolean);
  const currentWords = currentStory.trim().split(/\s+/).filter(Boolean);

  const wordsAdded = Math.max(
    currentWords.length - previousWords.length,
    0
  );

  const wordsRemoved = Math.max(
    previousWords.length - currentWords.length,
    0
  );

  const paragraphsModified = Math.abs(
    currentStory.split(/\n{2,}/).length -
    previousStory.split(/\n{2,}/).length
  );

  return {
    wordsAdded,
    wordsRemoved,
    paragraphsModified,
    editingDuration: Math.floor(
      (Date.now() - startTime) / 60000
    ),
    totalRevisions: 1,
  };
}

export function getSessionHistory(): EditingSessionHistory[] {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return [];
  }
  try {
    return JSON.parse(
      localStorage.getItem("editing-session-history") || "[]"
    ) as EditingSessionHistory[];
  } catch {
    return [];
  }
}

export function saveSessionHistory(
  history: EditingSessionHistory[]
) {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return;
  }
  localStorage.setItem(
    "editing-session-history",
    JSON.stringify(history)
  );
}