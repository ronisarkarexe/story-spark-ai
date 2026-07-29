import { useMemo } from "react";
import {
  analyzePublishingReadiness,
} from "../../utils/storyPublishingReadiness";

interface Props {
  story: string;
}

export default function StoryPublishingReadiness({
  story,
}: Props) {

  const report = useMemo(
    () => analyzePublishingReadiness(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🚀 AI Story Publishing Readiness
      </h2>

      <div className="rounded-lg bg-indigo-600 p-5 mb-8 text-center">

        <p className="text-white">
          Overall Publishing Score
        </p>

        <h3 className="text-5xl font-bold text-white">
          {report.overallScore}/100
        </h3>

      </div>

      <div className="space-y-4">

        {report.metrics.map(metric => (

          <div
            key={metric.name}
            className="rounded-lg border border-zinc-700 p-4"
          >

            <div className="flex justify-between">

              <h3 className="font-semibold text-white">
                {metric.name}
              </h3>

              <span className="text-indigo-400 font-bold">
                {metric.score}
              </span>

            </div>

            <p className="text-sm text-gray-400 mt-2">
              Status: {metric.status}
            </p>

            <p className="text-sm text-gray-300 mt-1">
              💡 {metric.recommendation}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}