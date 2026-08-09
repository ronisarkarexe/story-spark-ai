import React, { useState } from "react";
import {
  GenreWeight,
  normalizeWeights,
} from "../../utils/genreWeights";

export default function GenreWeightControls() {

  const [genres, setGenres] = useState<GenreWeight[]>([
    { genre: "Fantasy", weight: 50 },
    { genre: "Mystery", weight: 50 },
  ]);

  const updateWeight = (
    index: number,
    value: number
  ) => {
    const updated = [...genres];
    updated[index].weight = value;
    setGenres(normalizeWeights({ genres: updated }).genres);
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🎭 Genre Weight Controls
      </h2>

      {genres.map((genre, index) => (
        <div key={genre.genre} className="mb-6">

          <div className="flex justify-between text-white mb-2">
            <span>{genre.genre}</span>
            <span>{genre.weight}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={genre.weight}
            onChange={(e) =>
              updateWeight(index, Number(e.target.value))
            }
            className="w-full"
          />
        </div>
      ))}

      <div className="text-gray-300 mt-4">
        Selected Mix:
      </div>

      <ul className="text-white mt-2">
        {genres.map((g) => (
          <li key={g.genre}>
            {g.genre}: {g.weight}%
          </li>
        ))}
      </ul>

    </div>
  );
}