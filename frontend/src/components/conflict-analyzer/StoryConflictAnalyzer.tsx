import { useMemo } from "react";
import {
  analyzeStoryConflicts,
} from "../../utils/storyConflictAnalyzer";

interface Props {
  story: string;
  onReanalyze: () => void;
}

export default function StoryConflictAnalyzer({
  story,
  onReanalyze,
}: Props) {

  const conflicts = useMemo(
    () => analyzeStoryConflicts(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-white">
          ⚔️ AI Story Conflict Analyzer
        </h2>

        <button
          onClick={onReanalyze}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Reanalyze
        </button>

      </div>

      <div className="space-y-5">

        {conflicts.map((conflict) => (

          <div
            key={conflict.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex justify-between">

              <h3 className="text-lg font-semibold text-white">
                {conflict.title}
              </h3>

              <span className="text-indigo-400 font-bold">
                {conflict.strength}/100
              </span>

            </div>

            <p className="text-gray-300 mt-2">
              <strong>Type:</strong> {conflict.type}
            </p>

            <p className="text-gray-300">
              <strong>Location:</strong> {conflict.section}
            </p>

            <p className="text-gray-400 mt-3">
              💡 {conflict.suggestion}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}