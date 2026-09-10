import React, { useState } from "react";
import {
  analyzeStory,
  PlotHoleIssue,
} from "../../utils/plotHoleDetector";

interface Props {
  story: string;
}

export default function PlotHoleDetector({
  story,
}: Props) {
  const [issues, setIssues] = useState<PlotHoleIssue[]>([]);

  const handleAnalyze = () => {
    const result = analyzeStory(story);
    setIssues(result.issues);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">

      <h2 className="text-2xl font-bold text-white mb-5">
        🔍 AI Plot Hole Detector
      </h2>

      <button
        onClick={handleAnalyze}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Analyze Story
      </button>

      <div className="mt-6 space-y-4">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="rounded-lg border border-zinc-700 p-4"
          >
            <h3 className="text-white font-semibold">
              {issue.type}
            </h3>

            <p className="text-red-400">
              Severity: {issue.severity}
            </p>

            <p className="text-gray-300 mt-2">
              {issue.message}
            </p>

            <p className="text-green-400 mt-2">
              Suggestion:
            </p>

            <p className="text-gray-300">
              {issue.suggestion}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}