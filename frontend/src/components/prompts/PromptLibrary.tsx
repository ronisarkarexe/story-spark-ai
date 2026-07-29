import { useMemo, useState } from "react";
import {
  storyPrompts,
  searchPrompts,
} from "../../utils/promptLibrary";

interface Props {
  onInsertPrompt?: (prompt: string) => void;
}

export default function PromptLibrary({
  onInsertPrompt,
}: Props) {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filtered = useMemo(
    () => searchPrompts(search),
    [search]
  );

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        💡 Story Inspiration Library
      </h2>

      <input
        placeholder="Search prompts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 rounded-lg bg-zinc-800 p-3 text-white"
      />

      <div className="space-y-4">

        {filtered.map((prompt) => (
          <div
            key={prompt.id}
            className="rounded-lg border border-zinc-700 p-4"
          >
            <h3 className="text-lg font-semibold text-white">
              {prompt.title}
            </h3>

            <p className="text-gray-300 mt-2">
              {prompt.prompt}
            </p>

            <div className="text-sm text-gray-400 mt-2">
              {prompt.genre} • {prompt.theme} • {prompt.mood}
            </div>

            <div className="mt-4 flex gap-3">

              <button
                onClick={() =>
                  onInsertPrompt?.(prompt.prompt)
                }
                className="px-4 py-2 bg-indigo-600 rounded text-white"
              >
                Use Prompt
              </button>

              <button
                onClick={() =>
                  toggleFavorite(prompt.id)
                }
                className="px-4 py-2 bg-zinc-700 rounded text-white"
              >
                {favorites.includes(prompt.id)
                  ? "★ Saved"
                  : "☆ Save"}
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}