import { useEffect, useMemo, useState } from "react";
import {
  BookmarkNote,
  loadBookmarkNotes,
  saveBookmarkNotes,
  searchBookmarkNotes,
} from "../../utils/storyBookmarkNotes";

interface Props {
  storyId: string;
}

export default function StoryBookmarkNotes({
  storyId,
}: Props) {

  const [notes, setNotes] =
    useState<BookmarkNote[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    setNotes(loadBookmarkNotes());
  }, []);

  useEffect(() => {
    saveBookmarkNotes(notes);
  }, [notes]);

  const filtered = useMemo(
    () => searchBookmarkNotes(notes, search),
    [notes, search]
  );

  const addNote = () => {
    const title = prompt("Bookmark title");

    if (!title) return;

    const note = prompt("Bookmark note");

    if (!note) return;

    setNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        storyId,
        title,
        note,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-white">
          🔖 Bookmark Notes
        </h2>

        <button
          onClick={addNote}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Add Note
        </button>

      </div>

      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="mb-6 w-full rounded border border-zinc-700 bg-zinc-800 p-2 text-white"
      />

      <div className="space-y-4">

        {filtered.map((item) => (

          <div
            key={item.id}
            className="rounded-lg border border-zinc-700 p-4"
          >

            <h3 className="font-semibold text-white">
              {item.title}
            </h3>

            <p className="mt-2 text-gray-300">
              {item.note}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}