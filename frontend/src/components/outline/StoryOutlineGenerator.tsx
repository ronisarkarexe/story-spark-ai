import React, { useState } from "react";
import {
  generateOutline,
  regenerateOutline,
  StoryPrompt,
  StoryOutline,
} from "../../utils/storyOutline";

interface StoryOutlineGeneratorProps {
  prompt: string;
}

const StoryOutlineGenerator: React.FC<StoryOutlineGeneratorProps> = ({
  prompt,
}) => {
  const [outline, setOutline] = useState<StoryOutline>(
    generateOutline({ prompt } as StoryPrompt)
  );

  const handleRegenerate = () => {
    setOutline(regenerateOutline({ prompt }));
  };

  const updateField = (
    field: keyof StoryOutline,
    value: string | string[]
  ) => {
    setOutline((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        📝 Story Outline Generator
      </h2>

      {/* Introduction */}
      <div className="mb-5">
        <label className="block text-white mb-2 font-semibold">
          Introduction
        </label>

        <textarea
          value={outline.introduction}
          onChange={(e) =>
            updateField("introduction", e.target.value)
          }
          className="w-full bg-zinc-800 text-white rounded-lg p-3"
          rows={3}
        />
      </div>

      {/* Plot Points */}
      <div className="mb-5">
        <label className="block text-white mb-2 font-semibold">
          Major Plot Points
        </label>

        <textarea
          value={outline.plotPoints.join("\n")}
          onChange={(e) =>
            updateField(
              "plotPoints",
              e.target.value.split("\n")
            )
          }
          className="w-full bg-zinc-800 text-white rounded-lg p-3"
          rows={5}
        />
      </div>

      {/* Climax */}
      <div className="mb-5">
        <label className="block text-white mb-2 font-semibold">
          Climax
        </label>

        <textarea
          value={outline.climax}
          onChange={(e) =>
            updateField("climax", e.target.value)
          }
          className="w-full bg-zinc-800 text-white rounded-lg p-3"
          rows={3}
        />
      </div>

      {/* Conclusion */}
      <div className="mb-6">
        <label className="block text-white mb-2 font-semibold">
          Conclusion
        </label>

        <textarea
          value={outline.conclusion}
          onChange={(e) =>
            updateField("conclusion", e.target.value)
          }
          className="w-full bg-zinc-800 text-white rounded-lg p-3"
          rows={3}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleRegenerate}
          className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          🔄 Regenerate Outline
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          ✨ Generate Story
        </button>
      </div>
    </div>
  );
};

export default StoryOutlineGenerator;