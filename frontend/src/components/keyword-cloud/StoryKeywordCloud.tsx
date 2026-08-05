import { useMemo } from "react";
import {
  extractStoryKeywords,
} from "../../utils/storyKeywordCloud";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryKeywordCloud({
  story,
  onRefresh,
}: Props) {

  const keywords = useMemo(
    () => extractStoryKeywords(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          ☁️ Story Keyword Cloud
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="flex flex-wrap gap-3">

        {keywords.map((keyword) => (

          <span
            key={keyword.id}
            className="rounded-full bg-indigo-600 px-4 py-2 text-white transition hover:scale-105"
            style={{
              fontSize: `${Math.min(
                24,
                12 + keyword.count * 2
              )}px`,
            }}
            title={`${keyword.count} occurrences`}
          >
            {keyword.word}
          </span>

        ))}

      </div>

    </div>
  );
}