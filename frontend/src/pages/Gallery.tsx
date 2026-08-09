import { useState, useEffect } from "react";
import StoryRemix from "../components/remix/StoryRemix";
import toast from "react-hot-toast";

interface GalleryStory {
  id: string;
  title: string;
  content: string;
  author: string;
  is_public: boolean;
  rating: number;
  rating_count: number;
  remix_count: number;
  tags: string[];
  parent_story_id?: string | null;
  parent_author?: string;
}

interface PopularTag {
  name: string;
  count: number;
}

export default function Gallery() {
  const [stories, setStories] = useState<GalleryStory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<"newest" | "top_rated" | "most_popular">("newest");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [activeRemixStory, setActiveRemixStory] = useState<GalleryStory | null>(null);
  
  // Track recommendations per story ID
  const [recommendations, setRecommendations] = useState<Record<string, GalleryStory[]>>({});
  const [showRecsForId, setShowRecsForId] = useState<string | null>(null);

  // Fetch popular tags
  const fetchPopularTags = async () => {
    try {
      const res = await fetch("/api/v1/tags/popular");
      const json = await res.json();
      if (json.success) {
        setPopularTags(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load popular tags:", err);
    }
  };

  // Fetch gallery stories from Express backend with filter and sorting
  const fetchGalleryStories = async () => {
    setLoading(true);
    try {
      // Map sort filter
      let sortQuery = "createdAt";
      let orderQuery = "desc";
      let sortFilter = "";

      if (sortBy === "top_rated") {
        sortQuery = "averageRating";
      } else if (sortBy === "most_popular") {
        sortFilter = "mostPopular";
      }

      const tagsQuery = selectedTags.length > 0 ? `&tags=${selectedTags.join(",")}` : "";
      const sortFilterQuery = sortFilter ? `&sortFilter=${sortFilter}` : "";

      const res = await fetch(
        `/api/v1/post/lists?sortBy=${sortQuery}&orderBy=${orderQuery}${sortFilterQuery}${tagsQuery}&limit=100`
      );
      const json = await res.json();
      
      if (json.success) {
        // Map backend Post format to GalleryStory format
        const mappedStories: GalleryStory[] = (json.data || []).map((post: any) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          author: post.author?.name || "Anonymous",
          is_public: post.isPublished,
          rating: post.averageRating || 0,
          rating_count: post.totalRatings || 0,
          remix_count: post.reactions?.length || 0, // Fallback to reactions count
          tags: post.tags || [],
          parent_story_id: post.parentStoryId,
          parent_author: post.parentStoryId ? "Original Author" : undefined,
        }));
        setStories(mappedStories);
      }
    } catch (err) {
      console.error("Failed to load gallery stories:", err);
      toast.error("Failed to load stories.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations for a story
  const fetchRecommendations = async (storyId: string) => {
    if (recommendations[storyId]) return; // Cache check
    try {
      const res = await fetch(`/api/v1/tags/recommendations/${storyId}?limit=3`);
      const json = await res.json();
      if (json.success) {
        const mappedRecs = (json.data || []).map((post: any) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          author: post.author?.name || "Anonymous",
          tags: post.tags || [],
        }));
        setRecommendations(prev => ({ ...prev, [storyId]: mappedRecs }));
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
  };

  useEffect(() => {
    fetchPopularTags();
  }, []);

  useEffect(() => {
    fetchGalleryStories();
  }, [sortBy, selectedTags]);

  const handleRate = async (storyId: string, rating: number) => {
    try {
      const res = await fetch(`/api/v1/story-rating/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: storyId, rating }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Thank you for rating!");
        fetchGalleryStories();
      } else {
        toast.error(json.message || "Failed to rate story.");
      }
    } catch (err) {
      console.error("Failed to submit rating:", err);
      toast.error("Authentication required to rate stories.");
    }
  };

  const handleTagToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(prev => prev.filter(t => t !== tagName));
    } else {
      setSelectedTags(prev => [...prev, tagName]);
    }
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  // Determine CSS font size for tag cloud based on usage count
  const getTagSizeClass = (count: number) => {
    if (count > 10) return "text-sm md:text-base px-3.5 py-1.5 font-bold";
    if (count > 5) return "text-xs md:text-sm px-3 py-1 font-semibold";
    return "text-xs px-2.5 py-0.5 font-medium";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              ✨ Community Story Gallery
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Read, rate, and discover public stories from creators worldwide.
            </p>
          </div>

          {/* Sorting Buttons */}
          <div className="flex gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
            {(["newest", "top_rated", "most_popular"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSortBy(filter)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
                  sortBy === filter
                    ? "bg-purple-600 text-white shadow-md hover:bg-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {filter.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Cloud Visualization & Popular Tags Section */}
        {popularTags.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                ☁️ Explore Tag Cloud
              </h2>
              {selectedTags.length > 0 && (
                <button
                  onClick={clearTagFilters}
                  className="text-xs text-red-400 hover:text-red-300 hover:underline transition-all"
                >
                  Clear Filters ({selectedTags.length})
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5 items-center justify-center py-4 bg-slate-950/40 rounded-xl p-4 border border-slate-900/60">
              {popularTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.name}
                    onClick={() => handleTagToggle(tag.name)}
                    className={`rounded-full transition-all duration-300 hover:scale-105 ${getTagSizeClass(
                      tag.count
                    )} ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-lg shadow-purple-500/20"
                        : "bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-purple-500/30"
                    }`}
                  >
                    #{tag.name}
                    <span className="text-[10px] text-purple-300/70 ml-1.5 font-normal">
                      ({tag.count})
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Active Tag Filters Bar */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center bg-slate-950/20 p-2.5 rounded-lg border border-slate-900/50">
                <span className="text-xs text-slate-400">Filtering by:</span>
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-200"
                  >
                    #{tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="text-purple-400 hover:text-red-400 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Story Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-60 animate-pulse" />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-400">No stories match your criteria. Try adjusting your tag filters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl"
              >
                <div>
                  {/* Story Title & Author */}
                  <h3 className="text-lg font-bold text-slate-100 line-clamp-1">{story.title}</h3>
                  <p className="text-xs text-purple-400 font-medium mb-3">
                    by @{story.author}
                    {story.parent_author && (
                      <span className="text-slate-500 ml-1">
                        (Remixed from {story.parent_author})
                      </span>
                    )}
                  </p>

                  {/* Story Tags Cloud (Inline) */}
                  {story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {story.tags.map(tag => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagToggle(tag);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all ${
                            selectedTags.includes(tag)
                              ? "bg-purple-600 text-white"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}

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
                          } hover:scale-120 transition-transform duration-150`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="font-semibold text-slate-200 ml-1">
                        {story.rating.toFixed(1)} ({story.rating_count})
                      </span>
                    </div>

                    <span className="font-mono text-slate-400">🔥 {story.remix_count} likes</span>
                  </div>

                  {/* Recommendations Trigger */}
                  <div className="border-t border-slate-800/40 pt-2">
                    <button
                      onClick={() => {
                        if (showRecsForId === story.id) {
                          setShowRecsForId(null);
                        } else {
                          setShowRecsForId(story.id);
                          fetchRecommendations(story.id);
                        }
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-all"
                    >
                      💡 {showRecsForId === story.id ? "Hide Recommendations" : "Tag Recommendations"}
                    </button>

                    {showRecsForId === story.id && (
                      <div className="mt-2 space-y-1.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 animate-fadeIn">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1">Related Stories:</p>
                        {recommendations[story.id]?.length === 0 ? (
                          <p className="text-[11px] text-zinc-500 italic">No recommendations found.</p>
                        ) : (
                          recommendations[story.id]?.map(rec => (
                            <div key={rec.id} className="text-xs border-b border-slate-900/40 pb-1 last:border-b-0">
                              <p className="font-medium text-slate-200 line-clamp-1">{rec.title}</p>
                              <p className="text-[10px] text-purple-400">by @{rec.author}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remix Button */}
                  <button
                    onClick={() => setActiveRemixStory({ id: story.id, title: story.title, content: story.content } as any)}
                    className="w-full py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/20 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    🔀 Remix Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remix Modal Overlay */}
      {activeRemixStory && (
        <StoryRemix
          story={activeRemixStory as any}
          isLogin={true}
          onClose={() => setActiveRemixStory(null)}
          onRemixComplete={() => {
            setActiveRemixStory(null);
            fetchGalleryStories();
          }}
        />
      )}
    </div>
  );
}
