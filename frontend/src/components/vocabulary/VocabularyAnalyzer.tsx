import React, { useState } from "react";
import {
  analyzeVocabulary,
  VocabularyAnalysis,
} from "../../utils/vocabularyAnalyzer";

interface Props {
  story: string;
}

export default function VocabularyAnalyzer({
  story,
}: Props) {

  const [analysis, setAnalysis] =
    useState<VocabularyAnalysis | null>(null);

  const handleAnalyze = () => {
    setAnalysis(analyzeVocabulary(story));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-4">
        📚 Vocabulary Analyzer
      </h2>

      <button
        onClick={handleAnalyze}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Analyze Vocabulary
      </button>

      {analysis && (
        <div className="mt-6 space-y-4">

          <p className="text-white">
            Readability Score: {analysis.readabilityScore}/100
          </p>

          <p className="text-white">
            Vocabulary Diversity: {analysis.diversityScore}/100
          </p>

          <div>
            <h3 className="text-white font-semibold">
              Repeated Words
            </h3>

            <ul className="text-gray-300 list-disc ml-6">
              {analysis.repeatedWords.map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold">
              Suggestions
            </h3>

            {analysis.suggestions.map((item) => (
              <div
                key={item.id}
                className="border border-zinc-700 rounded-lg p-3 mt-2"
              >
                <p className="text-white">
                  <strong>{item.word}</strong> → {item.replacement}
                </p>

                <p className="text-gray-400">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}