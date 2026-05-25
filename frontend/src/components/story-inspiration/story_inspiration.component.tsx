import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryInspirationCard from "./story_inspiration_card.component";
import { inspirationData } from "./inspirationData";

const StoryInspirationComponent: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  const genres = ["All", "Fantasy", "Horror", "Sci-Fi", "Mystery", "Adventure", "Romance"];

  // Filter data based on search and genre selection
  const filteredStories = inspirationData.filter((story) => {
    const matchesGenre = selectedGenre === "All" || story.genre === selectedGenre;
    
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      story.title.toLowerCase().includes(searchLower) ||
      story.author.toLowerCase().includes(searchLower) ||
      story.summary.toLowerCase().includes(searchLower) ||
      story.genre.toLowerCase().includes(searchLower) ||
      story.themes.some((theme) => theme.toLowerCase().includes(searchLower));
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-white text-slate-900 animate-gradient-slow transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Background neon blobs */}
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-150px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-slate-700 hover:text-slate-900 hover:bg-gray-100 hover:border-indigo-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(99,102,241,0.12)] dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 dark:hover:border-indigo-500/30"
          >
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-sm font-semibold tracking-wide">Back to Home</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-16 relative mt-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Creative Writing Prompts
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-300 mb-6 tracking-tight drop-shadow-2xl">
            Story Inspiration Hub
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light dark:text-gray-400">
            Defeat the blank page. Explore curated motifs, central themes, and handpicked prompts based on famous classical masterpieces.
          </p>
        </div>

        {/* Search & Genre Filtering Controls */}
        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          
          {/* Search Input Box */}
          <div className="relative rounded-2xl bg-gray-50 border border-gray-200 p-1 flex items-center focus-within:border-indigo-500/50 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.12)] transition-all duration-300 dark:bg-white/[0.02] dark:border-white/10 dark:focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <span className="pl-4 text-slate-500 dark:text-gray-500">
              <i className="fas fa-search text-lg"></i>
            </span>
            <input
              type="text"
              placeholder="Search classic tales, authors, summary keywords, or themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 py-3 text-slate-900 placeholder:text-slate-400 text-base dark:text-gray-200 dark:placeholder:text-gray-500"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors mr-2 dark:text-gray-400 dark:hover:text-red-400"
                title="Clear Search"
              >
                <i className="fas fa-xmark text-lg"></i>
              </button>
            )}
          </div>

          {/* Genre Chips */}
          <div className="flex flex-wrap gap-2.5 justify-center">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedGenre === genre
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/35 border border-indigo-500/50"
                    : "bg-gray-100 text-slate-700 border border-gray-200 hover:bg-gray-200 hover:text-slate-900 dark:bg-white/5 dark:border-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

        </div>

        {/* Grid List of Stories */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <StoryInspirationCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded-3xl max-w-2xl mx-auto text-slate-900 dark:bg-white/[0.01] dark:border-white/5 dark:text-white">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-white/5">
              <i className="fas fa-search-minus text-2xl text-slate-500 dark:text-gray-500"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-gray-300">No Inspirations Found</h3>
            <p className="text-slate-600 max-w-sm mx-auto text-sm leading-relaxed dark:text-gray-500">
              We couldn't find any classic stories matching "{searchQuery}" in category "{selectedGenre}". Try clearing your filters or testing other terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-indigo-600 hover:text-indigo-500 font-semibold text-xs uppercase tracking-wider transition-all dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Call to Action Banner */}
        <div className="mt-32 relative rounded-3xl p-[1px] bg-gradient-to-b from-indigo-500/40 via-indigo-500/10 to-transparent overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <div className="relative bg-purple-50 text-purple-900 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-gray-200 text-center overflow-hidden h-full w-full shadow-2xl transition-colors duration-300 dark:bg-purple-950/40 dark:text-purple-200 dark:border-white/5">
            <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10 pointer-events-none transition-all duration-700 group-hover:bg-blue-500/30"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-purple-900 dark:text-purple-200 mb-4 tracking-tight drop-shadow-xl">
                Have a completely custom idea?
              </h2>
              <p className="text-purple-900/80 mb-8 max-w-xl mx-auto font-light leading-relaxed dark:text-purple-200/80">
                Skip the classical templates and construct your story completely from scratch with the help of our intelligent AI generation engine.
              </p>
              <button
                onClick={() => navigate("/stories")}
                className="group/btn px-8 py-3.5 rounded-full bg-blue-600 to-indigo-600 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 mx-auto border border-white/10"
              >
                <span>Write Custom Story</span>
                <i className="fas fa-arrow-right transform group-hover/btn:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StoryInspirationComponent;
