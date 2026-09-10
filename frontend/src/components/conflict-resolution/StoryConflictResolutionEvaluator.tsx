import { useMemo } from "react";
import {
  analyzeConflictResolution,
} from "../../utils/storyConflictResolutionEvaluator";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryConflictResolutionEvaluator({
  story,
  onRefresh,
}: Props) {

  const conflicts = useMemo(
    () => analyzeConflictResolution(story),
    [story]
  );

  const badgeColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-600";
      case "Partially Resolved":
        return "bg-yellow-600";
      default:
        return "bg-red-600";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          ⚔️ AI Story Conflict Resolution Evaluator
        </h2>

        <button
          onClick={onRefresh}
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

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-white">
                  {conflict.title}
                </h3>

                <p className="text-sm text-indigo-400">
                  {conflict.type} Conflict
                </p>

              </div>

              <span
                className={`rounded px-3 py-1 text-sm text-white ${badgeColor(
                  conflict.resolution
                )}`}
              >
                {conflict.resolution}
              </span>

            </div>

            <p className="mt-4 text-gray-300">
              {conflict.description}
            </p>

            <div className="mt-4 rounded-md bg-zinc-800 p-3">

              <p className="text-sm text-indigo-300">
                <strong>AI Suggestion:</strong>{" "}
                {conflict.suggestion}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}