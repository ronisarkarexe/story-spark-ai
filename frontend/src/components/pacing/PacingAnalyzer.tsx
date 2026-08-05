import React, { useState } from "react";
import {
  analyzePacing,
  PacingIssue,
} from "../../utils/pacingAnalyzer";

interface Props {
  story: string;
}

export default function PacingAnalyzer({
  story,
}: Props) {
  const [issues, setIssues] = useState<PacingIssue[]>([]);
  const [score, setScore] = useState(0);

  const handleAnalyze = () => {
    const result = analyzePacing(story);
    setIssues(result.issues);
    setScore(result.overallScore);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">

      <h2 className="text-2xl font-bold text-white mb-4">
        ⚡ Story Pacing Analyzer
      </h2>

      <button
        onClick={handleAnalyze}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Analyze Pacing
      </button>

      <div className="mt-4 text-white">
        Overall Score: {score}/100
      </div>

      <div className="space-y-4 mt-6">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="border border-zinc-700 rounded-lg p-4"
          >
            <h3 className="text-white font-semibold">
              {issue.type}
            </h3>

            <p className="text-yellow-400">
              Section: {issue.section}
            </p>

            <p className="text-red-400">
              Severity: {issue.severity}
            </p>

            <p className="text-gray-300 mt-2">
              {issue.suggestion}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}