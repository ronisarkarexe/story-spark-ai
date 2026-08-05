import { useMemo } from "react";
import {
  analyzeStoryEnding,
  regenerateEndingPrompt,
} from "../../utils/storyEndingAnalyzer";

interface Props {
  story: string;
  onRegenerate?: (prompt: string) => void;
}

export default function StoryEndingAnalyzer({
  story,
  onRegenerate,
}: Props) {
  const analysis = useMemo(
    () => analyzeStoryEnding(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🎬 AI Story Ending Analyzer
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">Ending Score</p>
          <h3 className="text-4xl font-bold text-indigo-400">
            {analysis.score}/100
          </h3>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">Quality</p>
          <h3 className="text-2xl font-semibold text-green-400">
            {analysis.quality}
          </h3>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div>❤️ Emotional Impact: {analysis.emotionalImpact}</div>

        <div>📖 Completeness: {analysis.completeness}</div>

        <div>🎯 Predictability: {analysis.predictability}</div>

      </div>

      <div className="mb-6">

        <h3 className="font-semibold text-white mb-3">
          Weak Points
        </h3>

        <ul className="list-disc ml-5 text-gray-300">
          {analysis.weaknesses.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

      </div>

      <div className="mb-6">

        <h3 className="font-semibold text-white mb-3">
          Suggestions
        </h3>

        <ul className="list-disc ml-5 text-gray-300">
          {analysis.suggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

      </div>

      <button
        onClick={() =>
          onRegenerate?.(
            regenerateEndingPrompt(story)
          )
        }
        className="rounded bg-indigo-600 px-4 py-2 text-white"
      >
        Regenerate Ending
      </button>

    </div>
  );
}