import React, { useState } from "react";
import {
  analyzeOutline,
  OutlineIssue,
} from "../../utils/outlineQualityAnalyzer";

interface Props {
  outline: string;
}

export default function OutlineQualityAnalyzer({
  outline,
}: Props) {
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState<OutlineIssue[]>([]);

  const handleAnalyze = () => {
    const result = analyzeOutline(outline);
    setScore(result.score);
    setIssues(result.issues);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-4">
        📋 Outline Quality Analyzer
      </h2>

      <button
        onClick={handleAnalyze}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Analyze Outline
      </button>

      <div className="mt-4 text-white">
        Quality Score: {score}/100
      </div>

      <div className="space-y-4 mt-6">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="border border-zinc-700 rounded-lg p-4"
          >
            <h3 className="text-white font-semibold">
              {issue.category}
            </h3>

            <p className="text-red-400">
              {issue.severity}
            </p>

            <p className="text-gray-300 mt-2">
              {issue.message}
            </p>

            <p className="text-green-400 mt-2">
              {issue.suggestion}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}