import { useMemo } from "react";
import {
  analyzeStoryPace,
} from "../../utils/storyPaceHeatmap";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryPaceHeatmap({
  story,
  onRefresh,
}: Props) {

  const sections = useMemo(
    () => analyzeStoryPace(story),
    [story]
  );

  const getColor = (pace: string) => {
    switch (pace) {
      case "Fast":
        return "bg-red-500";
      case "Balanced":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🔥 AI Story Pace Heatmap
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="space-y-5">

        {sections.map((section) => (

          <div
            key={section.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between mb-3">

              <h3 className="font-semibold text-white">
                {section.title}
              </h3>

              <span className="text-sm text-gray-300">
                {section.pace}
              </span>

            </div>

            <div className="h-5 rounded bg-zinc-700 overflow-hidden">

              <div
                className={`h-full ${getColor(section.pace)}`}
                style={{
                  width: `${section.score}%`,
                }}
              />

            </div>

            <p className="mt-3 text-gray-300">
              {section.suggestion}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}