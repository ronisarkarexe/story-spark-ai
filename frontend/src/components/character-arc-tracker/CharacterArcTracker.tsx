import { useMemo } from "react";
import { analyzeCharacterArcs } from "../../utils/characterArcTracker";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function CharacterArcTracker({
  story,
  onRefresh,
}: Props) {

  const analysis = useMemo(
    () => analyzeCharacterArcs(story),
    [story]
  );

  const badgeColor = (growth: string) => {
    switch (growth) {
      case "Strong":
        return "bg-green-600";
      case "Moderate":
        return "bg-yellow-600";
      default:
        return "bg-red-600";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          👤 AI Character Arc Tracker
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Reanalyze
        </button>

      </div>

      <div className="mb-6 rounded-lg bg-zinc-800 p-4">

        <h3 className="text-lg font-semibold text-white">
          Overall Character Development
        </h3>

        <p className="mt-2 text-3xl font-bold text-indigo-400">
          {analysis.overallScore}%
        </p>

      </div>

      <div className="space-y-5">

        {analysis.characters.map((character) => (

          <div
            key={character.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-semibold text-white">
                {character.name}
              </h3>

              <span
                className={`rounded px-3 py-1 text-white ${badgeColor(
                  character.growth
                )}`}
              >
                {character.growth}
              </span>

            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">

              <div>
                <p className="text-gray-400 text-sm">Beginning</p>
                <p className="text-white">
                  {character.beginning}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Ending</p>
                <p className="text-white">
                  {character.ending}
                </p>
              </div>

            </div>

            <p className="mt-4 text-gray-300">
              {character.summary}
            </p>

            <div className="mt-4 rounded bg-zinc-800 p-3">

              <p className="text-green-300">
                <strong>AI Suggestion:</strong>{" "}
                {character.suggestion}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}