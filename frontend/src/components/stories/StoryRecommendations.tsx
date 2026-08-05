import React from "react";

interface Story {
  title: string;
  content: string;
  tag: string;
}

interface StoryRecommendationsProps {
  story: Story;
  onClose: () => void;
}

const recommendations = [
  {
    genre: "Fantasy",
    title: "The Lost Kingdom",
    reason: "Recommended because you enjoy magical worlds and epic adventures.",
  },
  {
    genre: "Mystery",
    title: "The Secret Shadow",
    reason: "Matches your interest in suspense and unexpected twists.",
  },
  {
    genre: "Romance",
    title: "A Heart Across Time",
    reason: "Suggested based on emotional storytelling and character connections.",
  },
  {
    genre: "Science Fiction",
    title: "Beyond the Stars",
    reason: "Perfect for readers who love futuristic worlds and technology.",
  },
];

const StoryRecommendations: React.FC<StoryRecommendationsProps> = ({
  story,
  onClose,
}) => {
  const filteredRecommendations = recommendations.filter(
    (item) =>
      item.genre.toLowerCase() === story.tag.toLowerCase()
  );

  const displayRecommendations =
    filteredRecommendations.length > 0
      ? filteredRecommendations
      : recommendations.slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-3xl p-6 border border-slate-700">
        
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-white">
            📚 Personalized Story Recommendations
          </h2>

          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-300 mb-6">
          Recommendations based on your current story genre and reading preferences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayRecommendations.map((item, index) => (
            <div
              key={index}
              className="bg-slate-700 rounded-xl p-4 border border-slate-600 hover:scale-105 transition-transform"
            >
              <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                {item.genre}
              </span>

              <h3 className="text-lg font-semibold text-white mt-3">
                {item.title}
              </h3>

              <p className="text-slate-300 text-sm mt-2">
                {item.reason}
              </p>

              <button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
                Explore Story
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryRecommendations;