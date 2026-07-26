export interface StoryRevision {
  id: number;
  timestamp: string;
  content: string;
}

export interface StoryDiff {
  additions: number;
  deletions: number;
  modifications: number;
}

export function createRevision(
  content: string
): StoryRevision {
  return {
    id: Date.now(),
    timestamp: new Date().toLocaleString(),
    content,
  };
}

export function compareRevisions(
  oldContent: string,
  newContent: string
): StoryDiff {
  const oldWords = oldContent.split(/\s+/);
  const newWords = newContent.split(/\s+/);

  return {
    additions: Math.max(newWords.length - oldWords.length, 0),
    deletions: Math.max(oldWords.length - newWords.length, 0),
    modifications: Math.min(oldWords.length, newWords.length),
  };
}

export function restoreRevision(
  revision: StoryRevision
): string {
  return revision.content;
}