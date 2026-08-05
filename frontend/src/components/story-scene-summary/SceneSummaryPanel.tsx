import { useMemo } from "react";
import { generateSceneSummaries } from "../../utils/sceneSummaryGenerator";

interface Props {
  story: string;
}

export default function SceneSummaryPanel({
  story,
}: Props) {
  const summaries = useMemo(
    () => generateSceneSummaries(story),
    [story]
  );

  const copyAll = () => {
    navigator.clipboard.writeText(
      summaries
        .map(
          (scene) =>
            `${scene.title}\n${scene.summary}`
        )
        .join("\n\n")
    );
  };

  return (
    <aside className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-5">

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Scene Summaries
        </h2>

        <button
          onClick={copyAll}
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Copy All
        </button>
      </div>

      <div className="space-y-4">
        {summaries.map((scene) => (
          <details
            key={scene.id}
            className="rounded-lg border border-zinc-700 p-3"
          >
            <summary className="cursor-pointer font-semibold text-blue-400">
              {scene.title}
            </summary>

            <p className="mt-3 text-gray-300">
              {scene.summary}
            </p>
          </details>
        ))}
      </div>

    </aside>
  );
}   