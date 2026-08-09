export interface BookmarkNote {
  id: number;
  storyId: string;
  title: string;
  note: string;
  createdAt: string;
}

const STORAGE_KEY = "story-bookmark-notes";

export function loadBookmarkNotes(): BookmarkNote[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveBookmarkNotes(notes: BookmarkNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function searchBookmarkNotes(
  notes: BookmarkNote[],
  keyword: string
) {
  return notes.filter(
    (item) =>
      item.title.toLowerCase().includes(keyword.toLowerCase()) ||
      item.note.toLowerCase().includes(keyword.toLowerCase())
  );
}