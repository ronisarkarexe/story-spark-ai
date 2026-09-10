import { useMemo } from "react";
import { analyzeTitle } from "../../utils/storyTitleRating";

interface Props {
  title: string;
  onReplace?: (title: string) => void;
}

export default function StoryTitleRating({
  title,
  onReplace,
}: Props) {
  const analysis = useMemo(
    () => analyzeTitle(title),
    [title]
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🏆 AI Story Title Rating
      </h2>

      <div className="mb-6">
        <p className="text-gray-400">
          Overall Score
        </p>

        <h1 className="text-5xl font-bold text-indigo-400">
          {analysis.score}/100
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-6">

        <div>🎨 Creativity: {analysis.creativity}</div>
        <div>📖 Relevance: {analysis.relevance}</div>
        <div>✨ Clarity: {analysis.clarity}</div>
        <div>❤️ Reader Appeal: {analysis.appeal}</div>

      </div>

      <div className="mb-6">

        <h3 className="font-semibold text-white mb-2">
          Strengths
        </h3>

        <ul className="list-disc ml-5 text-gray-300">
          {analysis.strengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

      </div>

      <div className="mb-6">

        <h3 className="font-semibold text-white mb-2">
          Weaknesses
        </h3>

        <ul className="list-disc ml-5 text-gray-300">
          {analysis.weaknesses.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

      </div>

      <div>

        <h3 className="font-semibold text-white mb-3">
          Suggested Titles
        </h3>

        {analysis.suggestions.map((item) => (
          <button
            key={item}
            onClick={() => onReplace?.(item)}
            className="block mb-2 w-full rounded bg-indigo-600 px-4 py-2 text-white"
          >
            {item}
          </button>
        ))}

      </div>
    </div>
  );
}