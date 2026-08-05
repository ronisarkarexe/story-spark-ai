import { useMemo, useState } from "react";
import {
  analyzePlotStructure,
} from "../../utils/storyPlotStructureAnalyzer";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryPlotStructureAnalyzer({
  story,
  onRefresh,
}: Props) {
  const [framework, setFramework] = useState("Three-Act Structure");

  const analysis = useMemo(
    () => analyzePlotStructure(story, framework),
    [story, framework]
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "Strong":
        return "bg-green-600";
      case "Needs Improvement":
        return "bg-yellow-600";
      default:
        return "bg-red-600";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <h2 className="text-2xl font-bold text-white">
          📖 AI Story Plot Structure Analyzer
        </h2>

        <div className="flex gap-3">

          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="rounded border border-zinc-700 bg-zinc-800 p-2 text-white"
          >
            <option>Three-Act Structure</option>
            <option>Hero's Journey</option>
            <option>Freytag's Pyramid</option>
          </select>

          <button
            onClick={onRefresh}
            className="rounded bg-indigo-600 px-4 py-2 text-white"
          >
            Reanalyze
          </button>

        </div>

      </div>

      <div className="mb-6 rounded-lg bg-zinc-800 p-4">

        <h3 className="text-lg font-semibold text-white">
          Overall Structure Score
        </h3>

        <p className="mt-2 text-3xl font-bold text-green-400">
          {analysis.overallScore}%
        </p>

      </div>

      <div className="space-y-5">

        {analysis.stages.map((stage) => (

          <div
            key={stage.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold text-white">
                {stage.stage}
              </h3>

              <span
                className={`rounded px-3 py-1 text-white ${statusColor(stage.status)}`}
              >
                {stage.status}
              </span>

            </div>

            <p className="mt-3 text-gray-300">
              {stage.explanation}
            </p>

            <div className="mt-3 h-2 rounded bg-zinc-700">

              <div
                className="h-2 rounded bg-indigo-500"
                style={{ width: `${stage.score}%` }}
              />

            </div>

            <p className="mt-2 text-sm text-gray-400">
              Score: {stage.score}%
            </p>

            <div className="mt-4 rounded bg-zinc-800 p-3">

              <p className="text-sm text-green-300">
                <strong>AI Recommendation:</strong>{" "}
                {stage.suggestion}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}