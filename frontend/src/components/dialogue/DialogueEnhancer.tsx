import React, { useState } from "react";
import {
  analyzeDialogue,
  DialogueSuggestion,
} from "../../utils/dialogueEnhancer";

interface Props {
  story: string;
}

export default function DialogueEnhancer({
  story,
}: Props) {
  const [suggestions, setSuggestions] = useState<
    DialogueSuggestion[]
  >([]);

  const handleAnalyze = () => {
    const result = analyzeDialogue(story);
    setSuggestions(result.suggestions);
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">

      <h2 className="text-2xl font-bold text-white mb-4">
        💬 AI Dialogue Enhancer
      </h2>

      <button
        onClick={handleAnalyze}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Analyze Dialogue
      </button>

      <div className="space-y-4 mt-6">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="border border-zinc-700 rounded-lg p-4"
          >
            <p className="text-gray-300">
              <strong>Original:</strong> {item.original}
            </p>

            <p className="text-green-400 mt-2">
              <strong>Suggestion:</strong> {item.suggestion}
            </p>

            <p className="text-yellow-400 mt-2">
              {item.reason}
            </p>

            <div className="flex gap-3 mt-4">
              <button className="bg-green-600 px-3 py-1 rounded text-white">
                Accept
              </button>

              <button className="bg-red-600 px-3 py-1 rounded text-white">
                Ignore
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}