import React, { useState } from "react";
import {
  tonePresets,
  TonePreset,
} from "../../utils/storyTone";

interface Props {
  story: string;
}

export default function StoryTonePresets({
  story,
}: Props) {
  const [selectedTone, setSelectedTone] =
    useState<TonePreset>(tonePresets[0]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🎭 Story Tone Presets
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {tonePresets.map((tone) => (
          <button
            key={tone.id}
            onClick={() => setSelectedTone(tone)}
            className={`rounded-lg p-4 border transition ${
              selectedTone.id === tone.id
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-zinc-800 border-zinc-700 text-gray-300"
            }`}
          >
            <h3 className="font-semibold">
              {tone.name}
            </h3>

            <p className="text-sm mt-2">
              {tone.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 text-white">
        Selected Tone:
        <strong> {selectedTone.name}</strong>
      </div>

      <button
        className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg"
      >
        Generate Story
      </button>
    </div>
  );
}