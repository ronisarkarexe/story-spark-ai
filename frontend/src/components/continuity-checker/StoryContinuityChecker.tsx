import { useMemo } from "react";
import {
  analyzeStoryContinuity,
} from "../../utils/storyContinuityChecker";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryContinuityChecker({
  story,
  onRefresh,
}: Props) {

  const analysis = useMemo(
    () => analyzeStoryContinuity(story),
    [story]
  );

  const severityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-600";
      case "Medium":
        return "bg-yellow-600";
      default:
        return "bg-green-600";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🔍 AI Story Continuity Checker
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Reanalyze
        </button>

      </div>

      <div className="mb-6 rounded-lg bg-zinc-800 p-4">

        <h3 className="text-lg font-semibold text-white">
          Overall Continuity Score
        </h3>

        <p className="mt-2 text-3xl font-bold text-green-400">
          {analysis.overallScore}%
        </p>

      </div>

      <div className="space-y-5">

        {analysis.issues.map((item) => (

          <div
            key={item.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-white">
                  {item.category}
                </h3>

                <p className="text-sm text-gray-400">
                  {item.section}
                </p>

              </div>

              <span
                className={`rounded px-3 py-1 text-white ${severityColor(
                  item.severity
                )}`}
              >
                {item.severity}
              </span>

            </div>

            <p className="mt-4 text-gray-300">
              {item.issue}
            </p>

            <div className="mt-4 rounded bg-zinc-800 p-3">

              <p className="text-green-300">
                <strong>AI Suggestion:</strong>{" "}
                {item.suggestion}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}