import React, { useState } from "react";
import {
  audienceOptions,
  AudienceOption,
} from "../../utils/storyAudience";

interface Props {
  prompt: string;
}

export default function StoryAudienceSelector({
  prompt,
}: Props) {
  const [selectedAudience, setSelectedAudience] =
    useState<AudienceOption>(audienceOptions[0]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        👥 Audience Based Story Generation
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {audienceOptions.map((audience) => (
          <button
            key={audience.id}
            onClick={() => setSelectedAudience(audience)}
            className={`rounded-lg p-4 transition border ${
              selectedAudience.id === audience.id
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-zinc-800 border-zinc-700 text-gray-300"
            }`}
          >
            <h3 className="font-semibold">
              {audience.name}
            </h3>

            <p className="text-sm mt-2">
              {audience.description}
            </p>
          </button>
        ))}

      </div>

      <div className="mt-6 text-white">
        Selected Audience:
        <strong> {selectedAudience.name}</strong>
      </div>

      <button
        className="mt-6 px-5 py-2 bg-indigo-600 rounded-lg text-white"
      >
        Generate Story
      </button>
    </div>
  );
}