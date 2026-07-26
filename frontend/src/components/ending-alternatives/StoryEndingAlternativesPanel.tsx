import { useMemo, useState } from "react";
import {
  generateEndingAlternatives,
} from "../../utils/storyEndingAlternatives";

interface Props {
  story: string;
  originalEnding: string;
  onReplaceEnding: (ending: string) => void;
  onRegenerate: () => void;
}

export default function StoryEndingAlternativesPanel({
  story,
  originalEnding,
  onReplaceEnding,
  onRegenerate,
}: Props) {

  const endings = useMemo(
    () => generateEndingAlternatives(story),
    [story]
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🎭 AI Story Ending Alternatives
        </h2>

        <button
          onClick={onRegenerate}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Regenerate
        </button>

      </div>

      <div className="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-5">

        <h3 className="font-semibold text-white">
          Original Ending
        </h3>

        <p className="mt-3 text-gray-300">
          {originalEnding}
        </p>

      </div>

      <div className="space-y-5">

        {endings.map((ending) => (

          <div
            key={ending.id}
            className={`rounded-lg border p-5 ${
              selectedId === ending.id
                ? "border-indigo-500"
                : "border-zinc-700"
            }`}
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-white">
                  {ending.title}
                </h3>

                <p className="text-sm text-indigo-400">
                  {ending.style} • {ending.emotionalImpact}
                </p>

              </div>

              <button
                onClick={() => {
                  setSelectedId(ending.id);
                  onReplaceEnding(ending.content);
                }}
                className="rounded bg-indigo-600 px-4 py-2 text-white"
              >
                Use This Ending
              </button>

            </div>

            <p className="mt-4 text-gray-300">
              {ending.content}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}