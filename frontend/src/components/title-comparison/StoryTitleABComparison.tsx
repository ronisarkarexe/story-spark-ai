import { useMemo } from "react";
import {
  generateStoryTitleOptions,
} from "../../utils/storyTitleABComparison";

interface Props {
  story: string;
  onApplyTitle: (title: string) => void;
  onRegenerate: () => void;
}

export default function StoryTitleABComparison({
  story,
  onApplyTitle,
  onRegenerate,
}: Props) {

  const titles = useMemo(
    () => generateStoryTitleOptions(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🏷️ AI Story Title A/B Comparison
        </h2>

        <button
          onClick={onRegenerate}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Regenerate
        </button>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {titles.map((title) => (

          <div
            key={title.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <h3 className="text-xl font-bold text-white">
              {title.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm text-gray-300">

              <p>Creativity: {title.creativity}/100</p>
              <p>Relevance: {title.relevance}/100</p>
              <p>Memorability: {title.memorability}/100</p>
              <p>Emotional Appeal: {title.emotionalAppeal}/100</p>

            </div>

            <div className="mt-4 rounded bg-zinc-800 p-3">

              <p className="text-sm text-indigo-300">
                {title.feedback}
              </p>

            </div>

            <button
              onClick={() => onApplyTitle(title.title)}
              className="mt-5 w-full rounded bg-green-600 px-4 py-2 text-white"
            >
              Apply Title
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}