import { useMemo } from "react";
import {
  analyzeReadingLevel,
} from "../../utils/storyReadingLevelAnalyzer";

interface Props {
  story: string;
  onReanalyze: () => void;
}

export default function StoryReadingLevelAnalyzer({
  story,
  onReanalyze,
}: Props) {

  const report = useMemo(
    () => analyzeReadingLevel(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-white">
          📚 AI Story Reading Level Analyzer
        </h2>

        <button
          onClick={onReanalyze}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Reanalyze
        </button>

      </div>

      <div className="rounded-lg border border-zinc-700 p-5 mb-6">

        <h3 className="text-xl font-semibold text-indigo-400">
          {report.level}
        </h3>

        <p className="text-gray-300 mt-3">
          {report.explanation}
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">
            Vocabulary Score
          </p>

          <h3 className="text-3xl font-bold text-white">
            {report.vocabularyScore}/100
          </h3>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">
            Sentence Complexity
          </p>

          <h3 className="text-3xl font-bold text-white">
            {report.sentenceComplexity}/100
          </h3>
        </div>

      </div>

      <div>

        <h3 className="text-lg font-semibold text-white mb-3">
          Suggestions
        </h3>

        <ul className="list-disc ml-5 text-gray-300 space-y-2">

          {report.suggestions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}

        </ul>

      </div>

    </div>
  );
}