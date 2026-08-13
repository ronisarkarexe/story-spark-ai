import React from "react";
import FlowIssueCard from "./FlowIssueCard";
import { useNarrativeFlow } from "../../hooks/useNarrativeFlow";

export default function NarrativeFlowAnalyzer({ story }: { story: string }) {
  const { issues } = useNarrativeFlow(story);

  return (
    <div className="border rounded-xl p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">
          Narrative Flow Analysis
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Reanalyze
        </button>
      </div>

      {issues.length === 0 ? (
        <p>No narrative flow issues detected.</p>
      ) : (
        issues.map((issue: any) => (
          <FlowIssueCard
            key={issue.id}
            issue={issue}
          />
        ))
      )}
    </div>
  );
}