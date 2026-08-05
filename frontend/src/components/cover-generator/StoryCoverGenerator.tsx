import React, { useState } from "react";
import {
  generateCoverOptions,
  StoryInfo,
  CoverImage,
} from "../../utils/coverGenerator";

interface StoryCoverGeneratorProps extends StoryInfo {}

const StoryCoverGenerator: React.FC<StoryCoverGeneratorProps> = ({
  title,
  genre,
  theme,
  characters,
}) => {
  const [covers, setCovers] = useState<CoverImage[]>(
    generateCoverOptions({
      title,
      genre,
      theme,
      characters,
    })
  );

  const [selectedCover, setSelectedCover] = useState<number | null>(null);

  const handleRegenerate = () => {
    setCovers(
      generateCoverOptions({
        title,
        genre,
        theme,
        characters,
      })
    );
  };

  const handleDownload = (image: string) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "story-cover.png";
    link.click();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
      <h2 className="text-2xl font-bold text-white mb-5">
        🎨 AI Story Cover Generator
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {covers.map((cover) => (
          <div
            key={cover.id}
            className={`rounded-lg overflow-hidden border cursor-pointer transition ${
              selectedCover === cover.id
                ? "border-indigo-500"
                : "border-zinc-700"
            }`}
            onClick={() => setSelectedCover(cover.id)}
          >
            <img
              src={cover.image}
              alt={`Cover ${cover.id}`}
              className="w-full h-48 object-cover"
            />

            <div className="p-2 text-center text-white text-sm">
              Cover {cover.id}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleRegenerate}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
        >
          🔄 Regenerate
        </button>

        {selectedCover && (
          <button
            onClick={() =>
              handleDownload(
                covers.find((c) => c.id === selectedCover)?.image || ""
              )
            }
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            ⬇️ Download
          </button>
        )}
      </div>

      {selectedCover && (
        <div className="mt-4 text-green-400 font-medium">
          ✅ Cover {selectedCover} selected.
        </div>
      )}
    </div>
  );
};

export default StoryCoverGenerator;