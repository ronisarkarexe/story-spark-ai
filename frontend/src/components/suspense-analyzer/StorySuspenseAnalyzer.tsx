import { useMemo } from "react";
import { analyzeStorySuspense } from "../../utils/storySuspenseAnalyzer";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StorySuspenseAnalyzer({
  story,
  onRefresh,
}: Props) {

  const analysis = useMemo(
    () => analyzeStorySuspense(story),
    [story]
  );

  const badgeColor = (status: string) => {
    switch (status) {
      case "High":
        return "bg-green-600";
      case "Medium":
        return "bg-yellow-600";
      default:
        return "bg-red-600";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🎭 AI Story Suspense Analyzer
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
          Overall Suspense Score
        </h3>

        <p className="mt-2 text-3xl font-bold text-indigo-400">
          {analysis.overallScore}%
        </p>

      </div>

      <div className="space-y-5">

        {analysis.sections.map((section) => (

          <div
            key={section.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-white">
                  {section.title}
                </h3>

                <p className="text-sm text-gray-400">
                  Tension Score: {section.tensionScore}%
                </p>

              </div>

              <span
                className={`rounded px-3 py-1 text-white ${badgeColor(
                  section.status
                )}`}
              >
                {section.status}
              </span>

            </div>

            <p className="mt-4 text-gray-300">
              {section.observation}
            </p>

            <div className="mt-4 rounded bg-zinc-800 p-3">

              <p className="text-green-300">
                <strong>AI Suggestion:</strong>{" "}
                {section.suggestion}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}