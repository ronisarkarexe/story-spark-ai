import { useMemo } from "react";
import {
  analyzeVocabulary,
} from "../../utils/storyVocabularyGrowthTracker";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryVocabularyGrowthTracker({
  story,
  onRefresh,
}: Props) {

  const report = useMemo(
    () => analyzeVocabulary(story),
    [story]
  );

  const maxValue = Math.max(
    ...report.growthHistory.map((item) => item.uniqueWords),
    1
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          📚 Story Vocabulary Growth Tracker
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">

        <StatCard
          title="Total Words"
          value={report.totalWords}
        />

        <StatCard
          title="Unique Words"
          value={report.uniqueWords}
        />

        <StatCard
          title="Diversity"
          value={`${report.diversityScore}%`}
        />

      </div>

      <div className="mb-8">

        <h3 className="mb-4 text-lg font-semibold text-white">
          Frequently Repeated Words
        </h3>

        <div className="space-y-4">

          {report.overusedWords.map((item) => (

            <div
              key={item.word}
              className="rounded-lg border border-zinc-700 p-4"
            >
              <div className="flex justify-between">

                <span className="font-semibold text-white">
                  {item.word}
                </span>

                <span className="text-indigo-400">
                  {item.count} uses
                </span>

              </div>

              {item.alternatives.length > 0 && (
                <p className="mt-2 text-gray-300">
                  Alternatives: {item.alternatives.join(", ")}
                </p>
              )}

            </div>

          ))}

        </div>

      </div>

      <div>

        <h3 className="mb-4 text-lg font-semibold text-white">
          Vocabulary Growth
        </h3>

        <div className="space-y-3">

          {report.growthHistory.map((item) => (

            <div key={item.story}>

              <div className="mb-1 flex justify-between text-sm text-gray-300">
                <span>{item.story}</span>
                <span>{item.uniqueWords}</span>
              </div>

              <div className="h-3 rounded bg-zinc-700">

                <div
                  className="h-3 rounded bg-indigo-500"
                  style={{
                    width: `${(item.uniqueWords / maxValue) * 100}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-zinc-700 p-4 text-center">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-indigo-400">
        {value}
      </p>
    </div>
  );
}