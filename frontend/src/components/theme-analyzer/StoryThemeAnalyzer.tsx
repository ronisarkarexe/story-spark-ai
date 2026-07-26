import { useMemo } from "react";
import {
  analyzeStoryThemes,
} from "../../utils/storyThemeAnalyzer";

interface Props {
  story: string;
  onReanalyze: () => void;
}

export default function StoryThemeAnalyzer({
  story,
  onReanalyze,
}: Props) {

  const themes = useMemo(
    () => analyzeStoryThemes(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🎭 AI Story Theme Analyzer
        </h2>

        <button
          onClick={onReanalyze}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Reanalyze
        </button>

      </div>

      <div className="space-y-5">

        {themes.map((theme) => (

          <div
            key={theme.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-semibold text-white">
                {theme.name}
              </h3>

              <span className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">
                {theme.confidence}%
              </span>

            </div>

            <p className="mt-3 text-gray-300">
              {theme.description}
            </p>

            <p className="mt-3 text-sm text-indigo-400">
              Highlighted Section: {theme.highlightedSection}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}