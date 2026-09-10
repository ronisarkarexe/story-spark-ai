import { useMemo, useState } from "react";
import { analyzePOV } from "../../utils/povAnalyzer";

interface Props {
  story: string;
}

export default function POVConsistencyPanel({
  story,
}: Props) {

  const [selectedPOV, setSelectedPOV] =
    useState<"First Person" | "Third Person">(
      "First Person"
    );

  const issues = useMemo(
    () => analyzePOV(story, selectedPOV),
    [story, selectedPOV]
  );

  return (

    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

      <h2 className="mb-4 text-xl font-bold">
        Narrative POV Checker
      </h2>

      <select
        value={selectedPOV}
        onChange={(e) =>
          setSelectedPOV(
            e.target.value as
              | "First Person"
              | "Third Person"
          )
        }
        className="mb-5 rounded border bg-zinc-800 p-2"
      >
        <option>First Person</option>
        <option>Third Person</option>
      </select>

      {issues.length === 0 ? (

        <p className="text-green-500">
          No inconsistent POV changes found.
        </p>

      ) : (

        <div className="space-y-4">

          {issues.map((issue, index) => (

            <div
              key={index}
              className="rounded-lg border border-zinc-700 p-4"
            >

              <h3 className="font-semibold text-red-400">
                {issue.detectedPOV}
              </h3>

              <p className="mt-2 italic">
                "{issue.sentence}"
              </p>

              <p className="mt-3">
                {issue.reason}
              </p>

              <div className="mt-3 rounded bg-zinc-800 p-3">
                <strong>Suggestion</strong>

                <p>{issue.suggestion}</p>
              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}