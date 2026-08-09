import React, { useState } from "react";
import {
  perspectiveOptions,
  PerspectiveOption,
} from "../../utils/storyPerspective";

interface Props {
  story: string;
}

export default function StoryPerspectiveSwitcher({
  story,
}: Props) {
  const [selected, setSelected] = useState<PerspectiveOption>(
    perspectiveOptions[0]
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        📖 Story Perspective Switcher
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {perspectiveOptions.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className={`rounded-lg border p-4 transition ${
              selected.id === item.id
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-zinc-800 border-zinc-700 text-gray-300"
            }`}
          >
            <h3 className="font-semibold">
              {item.label}
            </h3>

            <p className="text-sm mt-2">
              {item.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 text-white">
        Selected Perspective:
        <strong> {selected.label}</strong>
      </div>

      <button
        className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg"
      >
        Regenerate Story
      </button>
    </div>
  );
}