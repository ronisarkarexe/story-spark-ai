import { useEffect, useState } from "react";
import {
  splitIntoChapters,
  renumberChapters,
  Chapter,
} from "../../utils/chapterUtils";

interface Props {
  story: string;
  onUpdate: (story: string) => void;
}

export default function ChapterReorderPanel({
  story,
  onUpdate,
}: Props) {

  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    setChapters(splitIntoChapters(story));
  }, [story]);

  const moveUp = (index: number) => {
    if (index === 0) return;

    const updated = [...chapters];

    [updated[index - 1], updated[index]] =
      [updated[index], updated[index - 1]];

    const reordered = renumberChapters(updated);

    setChapters(reordered);

    onUpdate(
      reordered
        .map((c) => `${c.title}\n${c.content}`)
        .join("\n\n")
    );
  };

  const moveDown = (index: number) => {
    if (index === chapters.length - 1) return;

    const updated = [...chapters];

    [updated[index], updated[index + 1]] =
      [updated[index + 1], updated[index]];

    const reordered = renumberChapters(updated);

    setChapters(reordered);

    onUpdate(
      reordered
        .map((c) => `${c.title}\n${c.content}`)
        .join("\n\n")
    );
  };

  return (

    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

      <h2 className="mb-5 text-xl font-bold">
        Chapter Reordering
      </h2>

      {chapters.map((chapter, index) => (

        <div
          key={chapter.id}
          className="mb-4 rounded-lg border border-zinc-700 p-4"
        >

          <div className="flex justify-between items-center">

            <h3 className="font-semibold">
              {chapter.title}
            </h3>

            <div className="space-x-2">

              <button
                onClick={() => moveUp(index)}
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                ↑
              </button>

              <button
                onClick={() => moveDown(index)}
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                ↓
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>

  );
}