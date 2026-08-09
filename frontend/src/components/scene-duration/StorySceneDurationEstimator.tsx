import { useMemo } from "react";
import {
  estimateSceneDurations,
} from "../../utils/storySceneDurationEstimator";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StorySceneDurationEstimator({
  story,
  onRefresh,
}: Props) {
  const report = useMemo(
    () => estimateSceneDurations(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          ⏱️ Story Scene Duration Estimator
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="mb-6 rounded-lg border border-zinc-700 p-5">

        <h3 className="text-lg font-semibold text-white">
          Total Reading Time
        </h3>

        <p className="mt-2 text-3xl font-bold text-indigo-400">
          {report.totalReadingTime} min
        </p>

      </div>

      <div className="space-y-4">

        {report.scenes.map((scene) => (

          <div
            key={scene.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold text-white">
                {scene.title}
              </h3>

              <span className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">
                {scene.readingTime} min
              </span>

            </div>

            <p className="mt-3 text-gray-300">
              Word Count: {scene.wordCount}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}