import { useMemo } from "react";
import {
  analyzeStorySymbolism,
} from "../../utils/storySymbolismDetector";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StorySymbolismDetector({
  story,
  onRefresh,
}: Props) {

  const symbols = useMemo(
    () => analyzeStorySymbolism(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🔍 AI Story Symbolism Detector
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="space-y-5">

        {symbols.map((item) => (

          <div
            key={item.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-semibold text-white">
                {item.symbol}
              </h3>

              <span className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">
                {item.type}
              </span>

            </div>

            <p className="mt-3 text-gray-300">
              {item.meaning}
            </p>

            <p className="mt-3 text-sm text-indigo-400">
              Related Passage: {item.relatedPassage}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}