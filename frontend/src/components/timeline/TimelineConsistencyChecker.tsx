import React, { useState } from "react";
import {
  analyzeTimeline,
  TimelineIssue,
} from "../../utils/timelineChecker";

interface Props {
  story: string;
}

export default function TimelineConsistencyChecker({
  story,
}: Props) {
  const [issues, setIssues] = useState<TimelineIssue[]>([]);

  const handleAnalyze = () => {
    const result = analyzeTimeline(story);
    setIssues(result.issues);
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">

      <h2 className="text-2xl font-bold text-white mb-4">
        📅 Timeline Consistency Checker
      </h2>

      <button
        onClick={handleAnalyze}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Analyze Timeline
      </button>

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
              Event: {issue.event}
            </p>

            <p className="text-red-400">
              Severity: {issue.severity}
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