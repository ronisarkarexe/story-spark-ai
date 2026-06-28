import React, { useState } from "react";

interface Props {
  story: {
    title: string;
    content: string;
  };
  onClose: () => void;
}

const suggestionsData = [
  {
    category: "Grammar",
    suggestion:
      "Consider refining sentence structure and correcting minor grammatical issues.",
  },
  {
    category: "Pacing",
    suggestion:
      "Some scenes can be expanded with more details to create better flow.",
  },
  {
    category: "Dialogue",
    suggestion:
      "Add more natural conversations to improve character interactions.",
  },
  {
    category: "Emotion",
    suggestion:
      "Enhance emotional descriptions to create a stronger connection with readers.",
  },
  {
    category: "Storytelling",
    suggestion:
      "Strengthen the climax and provide clearer transitions between major events.",
  },
];

const StoryImprovementSuggestions: React.FC<Props> = ({
  story,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = suggestionsData
      .map(
        (item) => `${item.category}: ${item.suggestion}`
      )
      .join("\n");

    await navigator.clipboard.writeText(text);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">
            ✨ AI Story Improvement Suggestions
          </h2>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-400 mb-5">
          Review suggestions to improve "{story.title}".
        </p>

        <div className="space-y-4">
          {suggestionsData.map((item, index) => (
            <div
              key={index}
              className="bg-slate-700 rounded-xl p-4"
            >
              <h3 className="font-semibold text-purple-300">
                {item.category}
              </h3>
              <p className="text-gray-200 mt-1">
                {item.suggestion}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCopy}
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500"
          >
            {copied ? "✓ Copied" : "📋 Copy Suggestions"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryImprovementSuggestions;