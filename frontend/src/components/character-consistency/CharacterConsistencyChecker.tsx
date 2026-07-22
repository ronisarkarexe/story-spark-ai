import { useMemo } from "react";
import {
  analyzeCharacterConsistency,
  getConsistencyScore,
} from "../../utils/characterConsistency";

interface Props {
  story: string;
}

export default function CharacterConsistencyChecker({
  story,
}: Props) {
  const issues = useMemo(
    () => analyzeCharacterConsistency(story),
    [story]
  );

  const score = getConsistencyScore(issues);

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