import { useState } from "react";
import useGenreRecommendation from "../../hooks/useGenreRecommendation";

export default function GenreRecommendation() {
  const recommendations = useGenreRecommendation();
  const [accepted, setAccepted] = useState<string[]>([]);

  const acceptGenre = (genre: string) => {
    if (!accepted.includes(genre)) {
      setAccepted([...accepted, genre]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto rounded-lg border bg-white shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          AI Genre Recommendation Engine
        </h2>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>

      {recommendations.map((item) => (
        <div
          key={item.genre}
          className="border rounded-lg p-4 mb-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">
                {item.genre}
              </h3>

              <p className="text-gray-600 text-sm mt-1">
                {item.reason}
              </p>
            </div>

            <span className="font-bold text-blue-600">
              {item.confidence}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div
              className="bg-green-600 h-3 rounded-full"
              style={{ width: `${item.confidence}%` }}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => acceptGenre(item.genre)}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Accept
            </button>

            <button
              className="px-3 py-2 bg-gray-300 rounded"
            >
              Ignore
            </button>
          </div>

          {accepted.includes(item.genre) && (
            <p className="text-green-600 mt-2 font-medium">
              ✓ Genre accepted
            </p>
          )}
        </div>
      ))}
    </div>
  );
}