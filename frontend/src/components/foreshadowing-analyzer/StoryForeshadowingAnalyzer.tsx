import { useMemo } from "react";
import {
  analyzeStoryForeshadowing,
} from "../../utils/storyForeshadowingAnalyzer";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryForeshadowingAnalyzer({
  story,
  onRefresh,
}: Props) {

  const items = useMemo(
    () => analyzeStoryForeshadowing(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🔮 AI Story Foreshadowing Analyzer
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Reanalyze
        </button>

      </div>

      <div className="space-y-5">

        {items.map((item) => (

          <div
            key={item.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold text-white">
                {item.hint}
              </h3>

              <span
                className={`rounded px-3 py-1 text-sm text-white ${
                  item.status === "Strong"
                    ? "bg-green-600"
                    : item.status === "Weak"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                {item.status}
              </span>

            </div>

            <p className="mt-3 text-gray-300">
              <strong>Related Event:</strong> {item.relatedEvent}
            </p>

            <p className="mt-3 text-indigo-400">
              <strong>Suggestion:</strong> {item.suggestion}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}