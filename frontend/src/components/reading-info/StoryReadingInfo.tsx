import { useMemo } from "react";
import { analyzeReadingInfo } from "../../utils/storyReadingInfo";

interface Props {
  story: string;
}

export default function StoryReadingInfo({
  story,
}: Props) {

  const info = useMemo(
    () => analyzeReadingInfo(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 mb-6">

      <h2 className="text-xl font-bold text-white mb-4">
        📖 Reading Information
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">
            Word Count
          </p>

          <h3 className="text-3xl font-bold text-white">
            {info.wordCount}
          </h3>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">
            Estimated Reading Time
          </p>

          <h3 className="text-3xl font-bold text-indigo-400">
            {info.readingTime} min
          </h3>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">
            Difficulty Level
          </p>

          <h3 className="text-2xl font-semibold text-green-400">
            {info.difficulty}
          </h3>
        </div>

      </div>

    </div>
  );
}