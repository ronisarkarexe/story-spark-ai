import { useMemo } from "react";
import { checkCharacterConsistency } from "../../utils/characterConsistency";

interface Props {
  story: string;
}

export default function CharacterConsistencyChecker({ story }: Props) {
  const issues = useMemo(() => {
    const conflicts = checkCharacterConsistency([{ content: story }]);
    return conflicts.map((c, idx) => ({
      id: idx,
      character: c.character,
      category: "Appearance",
      severity: "Medium",
      description: `Inconsistent ${c.attribute}. Was ${c.previous}, but is now ${c.current}.`,
      suggestion: `Change '${c.current}' back to '${c.previous}' to maintain consistency.`
    }));
  }, [story]);

  const score = Math.max(0, 100 - (issues.length * 10));

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        👤 Character Consistency Checker
      </h2>

      <div className="mb-6">
        <p className="text-4xl font-bold text-green-400">
          {score}/100
        </p>
        <p className="text-gray-400">
          Character Consistency Score
        </p>
      </div>

      <div className="space-y-4">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="rounded-lg border border-zinc-700 p-4"
          >
            <h3 className="font-semibold text-white">
              {issue.character}
            </h3>

            <p className="text-sm text-gray-400">
              {issue.category} • {issue.severity}
            </p>

            <p className="mt-2 text-gray-300">
              {issue.description}
            </p>

            <p className="mt-2 text-indigo-300">
              💡 {issue.suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}