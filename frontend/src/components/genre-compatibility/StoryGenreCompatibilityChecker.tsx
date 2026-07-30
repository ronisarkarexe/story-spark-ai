import { useMemo, useState } from "react";
import {
  analyzeGenreCompatibility,
} from "../../utils/storyGenreCompatibilityChecker";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryGenreCompatibilityChecker({
  story,
  onRefresh,
}: Props) {
  const [genre, setGenre] = useState("Fantasy");

  const analysis = useMemo(
    () => analyzeGenreCompatibility(story, genre),
    [story, genre]
  );

  const scoreColor = (score: number) => {
    if (score >= 85) return "bg-green-600";
    if (score >= 70) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <h2 className="text-2xl font-bold text-white">
          🎭 AI Genre Compatibility Checker
        </h2>

        <div className="flex gap-3">

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded border border-zinc-700 bg-zinc-800 p-2 text-white"
          >
            <option>Fantasy</option>
            <option>Science Fiction</option>
            <option>Mystery</option>
            <option>Romance</option>
            <option>Thriller</option>
            <option>Horror</option>
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
          Overall Compatibility
        </h3>

        <div
          className={`mt-3 inline-block rounded px-4 py-2 text-white ${scoreColor(
            analysis.overallScore
          )}`}
        >
          {analysis.overallScore}%
        </div>

      </div>

      <div className="space-y-5">

        {analysis.issues.map((issue) => (

          <div
            key={issue.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold text-white">
                {issue.section}
              </h3>

              <span
                className={`rounded px-3 py-1 text-white ${scoreColor(
                  issue.compatibility
                )}`}
              >
                {issue.compatibility}%
              </span>

            </div>

            <p className="mt-2 text-indigo-400">
              {issue.category}
            </p>

            <p className="mt-3 text-gray-300">
              {issue.explanation}
            </p>

            <div className="mt-4 rounded bg-zinc-800 p-3">

              <p className="text-sm text-green-300">
                <strong>Suggestion:</strong>{" "}
                {issue.suggestion}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}