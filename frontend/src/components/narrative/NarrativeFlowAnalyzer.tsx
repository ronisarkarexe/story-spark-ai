import FlowIssueCard from "./FlowIssueCard";
import { useNarrativeFlow } from "../../hooks/useNarrativeFlow";

interface NarrativeFlowAnalyzerProps {
  story: string;
}

export default function NarrativeFlowAnalyzer({
  story,
}: NarrativeFlowAnalyzerProps) {

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

        issues.map(issue => (

          <FlowIssueCard
            key={issue.id}
            issue={issue}
          />

        ))

      )}

    </div>

  );

}
