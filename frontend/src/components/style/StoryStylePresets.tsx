import React, { useState } from "react";
import {
  storyStyles,
  StoryStyle,
} from "../../utils/storyStylePresets";

export default function StoryStylePresets() {
  const [selectedStyle, setSelectedStyle] =
    useState<StoryStyle>(storyStyles[0]);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🎨 Story Style Presets
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {storyStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style)}
            className={`rounded-lg p-4 border transition ${
              selectedStyle.id === style.id
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-zinc-700 bg-zinc-800 text-gray-300"
            }`}
          >
            <h3 className="font-semibold">
              {style.name}
            </h3>

            <p className="text-sm mt-2">
              {style.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 text-white">
        Selected Style:
        <strong> {selectedStyle.name}</strong>
      </div>

      <button
        className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg"
      >
        Generate Story
      </button>
    </div>
  );
}