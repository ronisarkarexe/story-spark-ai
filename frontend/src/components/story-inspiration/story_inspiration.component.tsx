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
      story.themes.some((theme) => theme.toLowerCase().includes(searchLower));

    return matchesGenre && matchesSearch;
  });

  return (
    <div className="bg-gradient-to-br animate-gradient-slow min-h-screen pb-24 relative overflow-hidden">
      {/* Background neon blobs */}
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-150px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
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
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Defeat the blank page. Explore curated motifs, central themes, and handpicked prompts based on famous classical masterpieces.
          </p>
        </div>

        {/* Search & Genre Filtering Controls */}
        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          
          {/* Search Input Box */}
          <div className="relative rounded-2xl bg-white/[0.02] border border-white/10 p-1 flex items-center focus-within:border-indigo-500/50 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
            <span className="pl-4 text-gray-500">
              <i className="fas fa-search text-lg"></i>
            </span>
            <input
              type="text"
              placeholder="Search classic tales, authors, summary keywords, or themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 py-3 text-gray-200 placeholder-gray-500 text-base"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors mr-2"
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
                    : "bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
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
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search-minus text-2xl text-gray-500"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Inspirations Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
              We couldn't find any classic stories matching "{searchQuery}" in category "{selectedGenre}". Try clearing your filters or testing other terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-400 hover:text-indigo-300 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Call to Action Banner */}
        <div className="mt-32 relative rounded-3xl p-[1px] bg-gradient-to-b from-indigo-500/40 via-indigo-500/10 to-transparent overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <div className="relative bg-gradient-to-b from-[#0f1423]/90 to-[#0B0F19]/90 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/5 text-center overflow-hidden h-full w-full shadow-2xl">
            <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10 pointer-events-none transition-all duration-700 group-hover:bg-blue-500/30"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 mb-4 tracking-tight drop-shadow-xl">
                Have a completely custom idea?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto font-light leading-relaxed">
                Skip the classical templates and construct your story completely from scratch with the help of our intelligent AI generation engine.
              </p>
              <button
                onClick={() => navigate("/stories")}
                className="group/btn px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 mx-auto border border-white/10"
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
