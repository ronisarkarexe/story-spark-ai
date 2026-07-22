import { useMemo } from "react";
import { analyzeStoryComplexity } from "../../utils/storyComplexityAnalyzer";

interface Props {
  story: string;
}

export default function StoryComplexityAnalyzer({
  story,
}: Props) {
  const analysis = useMemo(
    () => analyzeStoryComplexity(story),
    [story]
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        📊 Story Complexity Analyzer
      </h2>

      <div className="mb-6">
        <h1 className="text-5xl font-bold text-indigo-400">
          {analysis.score}/100
        </h1>

        <p className="text-gray-300 mt-2">
          Complexity Level:
          <strong> {analysis.level}</strong>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div>📚 Vocabulary: {analysis.vocabularyScore}</div>

        <div>📝 Sentence Structure: {analysis.sentenceScore}</div>

        <div>📖 Narrative Depth: {analysis.narrativeScore}</div>

        <div>🎯 Plot Development: {analysis.plotScore}</div>

      </div>

      <div>

        <h3 className="font-semibold text-white mb-3">
          Suggestions
        </h3>

        <ul className="list-disc ml-5 text-gray-300">
          {analysis.suggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

      </div>

    </div>
  );
}