import React, { useMemo, useState } from "react";
import {
  generateChapters,
  regenerateChapter,
} from "../../utils/storyChapterGenerator";

interface Props {
  story: string;
}

export default function StoryChapterGenerator({
  story,
}: Props) {
  const initialChapters = useMemo(
    () => generateChapters(story),
    [story]
  );

  const [chapters, setChapters] = useState(initialChapters);

  const handleTitleChange = (
    index: number,
    value: string
  ) => {
    const updated = [...chapters];
    updated[index].title = value;
    setChapters(updated);
  };

  const handleRegenerate = (index: number) => {
    const updated = [...chapters];
    updated[index] = regenerateChapter(updated[index]);
    setChapters(updated);
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        📚 AI Chapter Generator
      </h2>

      {chapters.map((chapter, index) => (
        <div
          key={chapter.id}
          className="mb-5 border border-zinc-700 rounded-lg p-4"
        >
          <input
            value={chapter.title}
            onChange={(e) =>
              handleTitleChange(index, e.target.value)
            }
            className="w-full bg-zinc-800 text-white rounded p-2 mb-3"
          />

          <p className="text-gray-300 whitespace-pre-line">
            {chapter.content}
          </p>

          <button
            onClick={() => handleRegenerate(index)}
            className="mt-3 px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Regenerate Chapter
          </button>
        </div>
      ))}
    </div>
  );
}