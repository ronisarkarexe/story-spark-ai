import React, { useState } from "react";
import toast from "react-hot-toast";

interface StoryGenreTransformationProps {
  story: {
    title: string;
    content: string;
  };
  onClose: () => void;
}

const genres = [
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Science Fiction",
];

const StoryGenreTransformation: React.FC<
  StoryGenreTransformationProps
> = ({ story, onClose }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [transformedStory, setTransformedStory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleTransform = async () => {
    if (!selectedGenre) {
      toast.error("Please select a genre.");
      return;
    }

    setLoading(true);

    try {
      // Temporary demo transformation
      // Replace with AI API call later
      setTimeout(() => {
        const newStory = `
🎭 Genre: ${selectedGenre}

Original Title: ${story.title}

${story.content}

✨ This story has been reimagined with a ${selectedGenre.toLowerCase()} style while preserving the original characters and storyline.
`;

        setTransformedStory(newStory);
        setLoading(false);
        toast.success("Story transformed successfully!");
      }, 1500);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Transformation failed.");
    }
  };

  const handleCopy = async () => {
    if (!transformedStory) {
      toast.error("No transformed story available.");
      return;
    }

    await navigator.clipboard.writeText(transformedStory);
    toast.success("Transformed story copied!");
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">
            🎭 AI Genre Transformation
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Genre Selection */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">
            Select Genre
          </label>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600"
          >
            <option value="">
              Choose a genre
            </option>

            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Transform Button */}
        <button
          onClick={handleTransform}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-semibold"
        >
          {loading ? "Transforming..." : "✨ Transform Story"}
        </button>

        {/* Comparison Section */}
        {transformedStory && (
          <div className="grid md:grid-cols-2 gap-5 mt-6">

            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="font-bold mb-3 text-blue-400">
                Original Story
              </h3>

              <p className="whitespace-pre-wrap text-sm">
                {story.content}
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl">
              <div className="flex justify-between mb-3">
                <h3 className="font-bold text-purple-400">
                  Transformed Story
                </h3>

                <button
                  onClick={handleCopy}
                  className="bg-green-600 px-3 py-1 rounded text-sm"
                >
                  Copy
                </button>
              </div>

              <p className="whitespace-pre-wrap text-sm">
                {transformedStory}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default StoryGenreTransformation;