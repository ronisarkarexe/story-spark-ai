import React from "react";
import WorldRuleCard from "./WorldRuleCard";
import { useWorldConsistency } from "../../hooks/useWorldConsistency";

export default function WorldConsistencyManager({ story }: { story: string }) {
  const { rules } = useWorldConsistency(story);

  return (
    <div className="border rounded-xl p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">
          World Consistency Manager
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Reanalyze
        </button>
      </div>

      {rules.length === 0 ? (
        <p>No inconsistencies detected.</p>
      ) : (
        rules.map((rule: any) => (
          <WorldRuleCard
            key={rule.id}
            rule={rule}
          />
        ))
      )}
    </div>
  );
}