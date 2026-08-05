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

export function saveBookmarkNotes(
  notes: BookmarkNote[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notes)
  );
}

export function searchBookmarkNotes(
  notes: BookmarkNote[],
  keyword: string
) {
  return notes.filter(
    (item) =>
      item.note
        .toLowerCase()
        .includes(keyword.toLowerCase()) ||
      item.title
        .toLowerCase()
        .includes(keyword.toLowerCase())
  );
}

export function generateNoteId(notes: BookmarkNote[]): number {
  if (notes.length === 0) return 1;
  return Math.max(...notes.map((n) => n.id)) + 1;
}

export function addBookmarkNote(
  storyId: string,
  title: string,
  note: string
): BookmarkNote {
  const existing = loadBookmarkNotes();
  const newNote: BookmarkNote = {
    id: generateNoteId(existing),
    storyId,
    title,
    note,
    createdAt: new Date().toISOString(),
  };
  const updated = [...existing, newNote];
  saveBookmarkNotes(updated);
  return newNote;
}

export function updateBookmarkNote(
  id: number,
  updates: Partial<Pick<BookmarkNote, "title" | "note">>
): BookmarkNote | null {
  const existing = loadBookmarkNotes();
  const idx = existing.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  const updated: BookmarkNote = { ...existing[idx], ...updates };
  existing[idx] = updated;
  saveBookmarkNotes(existing);
  return updated;
}

export function deleteBookmarkNote(id: number): void {
  const existing = loadBookmarkNotes();
  const filtered = existing.filter((n) => n.id !== id);
  saveBookmarkNotes(filtered);
}