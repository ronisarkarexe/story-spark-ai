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
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#fdf8f0] text-[#2c1810] transition-colors duration-300 dark:bg-[#1a0f08] dark:text-[#f5ead6] parchment-page">
      {/* Background neon blobs */}
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-[#c9a227]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-150px] w-[500px] h-[500px] bg-[#8b5e3c]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded bg-[#f5ead6] border border-[#d4b896] text-[#5c3d2e] hover:text-[#2c1810] hover:bg-[#e8d5b0] transition-all duration-300 shadow-sm dark:bg-[#2c1810] dark:border-[#5c3d2e] dark:text-[#d4b896] dark:hover:text-[#f5ead6] font-[Cormorant_Garamond] text-xs font-bold uppercase tracking-wider"
          >
            <i className="fas fa-arrow-left text-xs transform group-hover:-translate-x-0.5 transition-transform"></i>
            <span className="font-bold">Back to Home</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-16 relative mt-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#c9a227]/5 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4b896] bg-[#f5ead6] text-[#8b5e3c] text-xs font-semibold tracking-widest uppercase mb-8 shadow-sm dark:bg-[#2c1810] dark:border-[#5c3d2e] dark:text-[#d4b896] font-[Cormorant_Garamond]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a227] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a227]"></span>
            </span>
            Creative Writing Prompts
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2c1810] via-[#8b1a1a] to-[#c9a227] mb-6 tracking-tight font-[Playfair_Display] dark:from-[#f5ead6] dark:via-[#c9a227] dark:to-[#d4b896]">
            Story Inspiration Hub
          </h1>
          
          <p className="text-xl text-[#5c3d2e] max-w-2xl mx-auto mb-10 leading-relaxed font-light dark:text-[#d4b896]/80 font-[EB_Garamond]">
            Defeat the blank page. Explore curated motifs, central themes, and handpicked prompts based on famous classical masterpieces.
          </p>
        </div>

        {/* Search & Genre Filtering Controls */}
        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          
          {/* Search Input Box */}
          <div className="relative rounded-lg bg-[#fdf8f0] border border-[#d4b896] p-1 flex items-center focus-within:border-[#8b1a1a] focus-within:shadow-md transition-all duration-300 dark:bg-[#1a0f08] dark:border-[#5c3d2e] dark:focus-within:border-[#c9a227]">
            <span className="pl-4 text-[#8b5e3c] dark:text-[#d4b896]">
              <i className="fas fa-search text-base"></i>
            </span>
            <input
              type="text"
              placeholder="Search classic tales, authors, summary keywords, or themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 py-3 text-[#2c1810] placeholder:text-[#5c3d2e]/40 text-base font-[EB_Garamond] dark:text-[#f5ead6] dark:placeholder:text-[#d4b896]/30"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-2 text-[#5c3d2e] hover:text-red-600 transition-colors mr-2 dark:text-[#d4b896] dark:hover:text-red-400"
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
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer font-[Cormorant_Garamond] ${
                  selectedGenre === genre
                    ? "bg-[#8b1a1a] text-[#fdf8f0] shadow-md border border-[#8b1a1a]"
                    : "bg-[#f5ead6] text-[#5c3d2e] border border-[#d4b896] hover:bg-[#e8d5b0] hover:text-[#2c1810] dark:bg-[#2c1810] dark:border-[#5c3d2e] dark:text-[#d4b896] dark:hover:bg-[#3d2314] dark:hover:text-[#f5ead6]"
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
          <div className="text-center py-20 bg-[#f5ead6] border border-[#d4b896] rounded-3xl max-w-2xl mx-auto text-[#2c1810] dark:bg-[#2c1810] dark:border-[#5c3d2e] dark:text-[#f5ead6]">
            <div className="w-16 h-16 bg-[#fdf8f0] rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-[#1a0f08]">
              <i className="fas fa-search-minus text-2xl text-[#8b5e3c]"></i>
            </div>
            <h3 className="text-xl font-bold font-[Playfair_Display] mb-2">No Inspirations Found</h3>
            <p className="text-[#5c3d2e] max-w-sm mx-auto text-sm leading-relaxed dark:text-[#d4b896] font-[EB_Garamond]">
              We couldn't find any classic stories matching "{searchQuery}" in category "{selectedGenre}". Try clearing your filters or testing other terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
              className="mt-6 parchment-btn text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Call to Action Banner */}
        <div className="mt-32 relative rounded-3xl p-[1px] bg-gradient-to-b from-[#d4b896]/40 via-[#d4b896]/10 to-transparent overflow-hidden group">
          <div className="absolute inset-0 bg-[#c9a227]/5 blur-2xl group-hover:bg-[#c9a227]/10 transition-all duration-700"></div>
          <div className="relative bg-[#f5ead6] text-[#2c1810] backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-[#d4b896] text-center overflow-hidden h-full w-full shadow-2xl transition-colors duration-300 dark:bg-[#2c1810] dark:text-[#f5ead6] dark:border-[#5c3d2e]">
            <div className="absolute -top-32 right-0 w-96 h-96 bg-[#c9a227]/5 rounded-full blur-[100px] -z-10 pointer-events-none transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold font-[Playfair_Display] text-[#8b1a1a] mb-4 tracking-tight dark:text-[#c9a227]">
                Have a completely custom idea?
              </h2>
              <p className="text-[#5c3d2e] mb-8 max-w-xl mx-auto font-light leading-relaxed dark:text-[#d4b896]/80 font-[EB_Garamond] text-lg">
                Skip the classical templates and construct your story completely from scratch with the help of our intelligent AI generation engine.
              </p>
              <button
                onClick={() => navigate("/stories")}
                className="parchment-btn-primary px-8 py-3.5 flex items-center justify-center gap-2 mx-auto"
              >
                <span>Write Custom Story</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StoryInspirationComponent;
