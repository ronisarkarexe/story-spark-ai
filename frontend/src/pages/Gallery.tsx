import React, { useState, useEffect } from "react";
import StoryRemix from "../components/remix/StoryRemix";

interface GalleryStory {
  id: string;
  title: string;
  content: string;
  author: string;
  is_public: boolean;
  rating: number;
  rating_count: number;
  remix_count: number;
  parent_story_id?: string | null;
  parent_author?: string;
}

export default function Gallery() {
  const [stories, setStories] = useState<GalleryStory[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "top_rated" | "most_remixed">("newest");
  const [activeRemixStory, setActiveRemixStory] = useState<GalleryStory | null>(null);

  const fetchGalleryStories = async (sort = sortBy) => {
    try {
      const res = await fetch(`/api/gallery?sort_by=${sort}`);
      const data = await res.json();
      setStories(data.stories || []);
    } catch (err) {
      console.error("Failed to load gallery stories:", err);
    }
  };

  useEffect(() => {
    fetchGalleryStories(sortBy);
  }, [sortBy]);

  const handleRate = async (storyId: string, rating: number) => {
    try {
      await fetch("/api/gallery/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story_id: storyId, rating }),
      });
      fetchGalleryStories(sortBy);
    } catch (err) {
      console.error("Failed to submit rating:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              ✨ Community Story Gallery
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Read, rate, and remix public stories from creators worldwide.
            </p>
          </div>

          {/* Sorting Buttons */}
          <div className="flex gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {(["newest", "top_rated", "most_remixed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSortBy(filter)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  sortBy === filter
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {filter.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg"
            >
              <div>
                {/* Story Title & Author */}
                <h3 className="text-lg font-bold text-slate-100 line-clamp-1">{story.title}</h3>
                <p className="text-xs text-purple-400 font-medium mb-3">
                  by @{story.author}
                  {story.parent_author && (
                    <span className="text-slate-400 ml-1">
                      (Remixed from @{story.parent_author})
                    </span>
                  )}
                </p>
                <p className="text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {story.content}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(story.id, star)}
                        className={`text-sm ${
                          star <= Math.round(story.rating) ? "text-amber-400" : "text-slate-600"
                        } hover:scale-110 transition-transform`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="font-semibold text-slate-200 ml-1">
                      {story.rating} ({story.rating_count})
                    </span>
                  </div>

                  <span className="font-mono text-slate-400">🔀 {story.remix_count} remixes</span>
                </div>

                {/* Remix Button */}
                <button
                  onClick={() => setActiveRemixStory({ uuid: story.id, title: story.title, content: story.content } as any)}
                  className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  🔀 Remix Story
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remix Modal Overlay */}
      {activeRemixStory && (
        <StoryRemix
          story={activeRemixStory as any}
          isLogin={true}
          onClose={() => setActiveRemixStory(null)}
          onRemixComplete={(remixed) => {
            setActiveRemixStory(null);
            fetchGalleryStories();
          }}
        />
      )}
    </div>
  );
}
