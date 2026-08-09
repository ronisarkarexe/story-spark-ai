import React from "react";

interface Story {
  id: string;
  title: string;
  genre: string;
  tags: string[];
  coverImage?: string;
}

interface SimilarStoriesProps {
  stories: Story[];
  onOpenStory?: (id: string) => void;
}

const SimilarStories: React.FC<SimilarStoriesProps> = ({
  stories,
  onOpenStory,
}) => {
  if (stories.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-white mb-6">
        📚 Similar Stories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-4"
          >
            {story.coverImage && (
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}

            <h3 className="text-lg font-semibold text-white">
              {story.title}
            </h3>

            <p className="text-sm text-zinc-400 mt-1">
              {story.genre}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-indigo-600 rounded-full text-white"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onOpenStory?.(story.id)}
              className="mt-5 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2"
            >
              Read Story
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarStories;