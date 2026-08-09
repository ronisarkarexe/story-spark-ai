import { useMemo } from "react";
import {
  generateFactSheet,
  copyFactSheet,
} from "../../utils/storyFactSheet";

interface Props {
  story: string;
}

export default function StoryFactSheet({
  story,
}: Props) {
  const sheet = useMemo(
    () => generateFactSheet(story),
    [story]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      copyFactSheet(sheet)
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        📋 Story Fact Sheet
      </h2>

      <div className="space-y-4 text-gray-300">

        <p>
          <strong>Characters:</strong>{" "}
          {sheet.characters.join(", ")}
        </p>

        <p>
          <strong>Locations:</strong>{" "}
          {sheet.locations.join(", ")}
        </p>

        <p>
          <strong>Timeline:</strong>{" "}
          {sheet.timeline}
        </p>

        <p>
          <strong>Genre:</strong>{" "}
          {sheet.genre}
        </p>

        <p>
          <strong>Themes:</strong>{" "}
          {sheet.themes.join(", ")}
        </p>

        <p>
          <strong>Conflict:</strong>{" "}
          {sheet.conflict}
        </p>

        <p>
          <strong>Resolution:</strong>{" "}
          {sheet.resolution}
        </p>

      </div>

      <div className="mt-6 flex gap-3">

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-indigo-600 rounded text-white"
        >
          Copy Summary
        </button>

        <button
          className="px-4 py-2 bg-zinc-700 rounded text-white"
        >
          Export
        </button>

      </div>
    </div>
  );
}