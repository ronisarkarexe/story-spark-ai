import React, { useState } from "react";
import {
  blendGenres,
} from "../../utils/genreBlend";

interface Props {
  prompt: string;
}

export default function GenreBlendGenerator({
  prompt,
}: Props) {

  const genres = [
    "Fantasy",
    "Mystery",
    "Sci-Fi",
    "Romance",
    "Adventure",
    "Horror",
    "Thriller",
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (genre: string) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter((g) => g !== genre));
    } else {
      setSelected([...selected, genre]);
    }
  };

  const handleGenerate = () => {
    blendGenres({
      genres: selected,
      prompt,
    });
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">

      <h2 className="text-2xl font-bold text-white mb-4">
        🎭 Genre Blend Generator
      </h2>

      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleToggle(genre)}
            className={`px-3 py-2 rounded ${
              selected.includes(genre)
                ? "bg-indigo-600 text-white"
                : "bg-zinc-700 text-gray-300"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg"
      >
        Generate Story
      </button>

      <div className="mt-6 text-white">
        Selected Genres:
        {selected.join(", ")}
      </div>

    </div>
  );
}