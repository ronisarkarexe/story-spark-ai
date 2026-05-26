import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface StoryInspiration {
  id: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  themes: string[];
  prompts: string[];
  image: string;
}

interface StoryInspirationCardProps {
  story: StoryInspiration;
}

const genreConfig: { [key: string]: { color: string; bg: string; border: string; icon: string } } = {
  Fantasy: {
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: "fas fa-wand-magic-sparkles",
  },
  Horror: {
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: "fas fa-ghost",
  },
  "Sci-Fi": {
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "fas fa-rocket",
  },
  Mystery: {
    color: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: "fas fa-user-secret",
  },
  Adventure: {
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: "fas fa-compass",
  },
  Romance: {
    color: "text-pink-300",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    icon: "fas fa-heart",
  },
};

const genreBadgeClasses: { [key: string]: string } = {
  Fantasy: "dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300",
  Horror: "dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300",
  "Sci-Fi": "dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-300",
  Mystery: "dark:bg-purple-500/10 dark:border-purple-500/30 dark:text-purple-300",
  Adventure: "dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300",
  Romance: "dark:bg-pink-500/10 dark:border-pink-500/30 dark:text-pink-300",
};

const StoryInspirationCard: React.FC<StoryInspirationCardProps> = ({ story }) => {
  const navigate = useNavigate();
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);

  const { title, author, genre, summary, themes, prompts, image } = story;
  const config = genreConfig[genre] || {
    color: "text-indigo-300",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    icon: "fas fa-book",
  };

  const handleGenerateSimilar = () => {
    // Construct a rich, descriptive prompt based on the classic story, selected inspiration angle, and themes
    const selectedPrompt = prompts[selectedPromptIdx];
    const finalPrompt = `[Genre: ${genre}] Write a creative story inspired by the classic work '${title}' by ${author}. Focus on the following themes: ${themes.join(
      ", "
    )}. Use this creative premise: ${selectedPrompt}`;

    navigate("/stories", { state: { prompt: finalPrompt } });
  };

  return (
    <div className="parchment-card group relative overflow-hidden flex flex-col h-full bg-[#f5ead6] border border-[#d4b896] dark:bg-[#2c1810] dark:border-[#5c3d2e]">
      
      {/* Zoom-in Card Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-[#fdf8f0] dark:bg-[#1a0f08]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5ead6] via-[#f5ead6]/40 to-transparent z-10 pointer-events-none dark:from-[#2c1810] dark:via-[#2c1810]/40 dark:to-transparent" />
        <img
          src={image}
          alt={title}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="motion-image w-full h-full object-cover filter brightness-[0.88] sepia-[0.1] contrast-[1.02] hover:brightness-100 transition-all duration-500"
        />
        
        {/* Genre tag */}
        <div className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded bg-[#fdf8f0] text-[#8b1a1a] border border-[#d4b896] text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 font-[Cormorant_Garamond] dark:bg-[#1a0f08] dark:border-[#5c3d2e] dark:text-[#c9a227]`}>
          <i className={`${config.icon} text-xs`}></i>
          {genre}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow relative z-20 -mt-8 bg-[#f5ead6] dark:bg-[#2c1810]">
        
        {/* Title and Author */}
        <div className="mb-3">
          <h3 className="text-xl font-bold font-[Playfair_Display] text-[#2c1810] hover:text-[#8b1a1a] transition-colors duration-300 tracking-tight leading-snug dark:text-[#f5ead6] dark:hover:text-[#c9a227]">
            {title}
          </h3>
          <span className="text-xs text-[#5c3d2e] flex items-center gap-1.5 font-medium mt-1 font-[Cormorant_Garamond] dark:text-[#d4b896]">
            <i className="fas fa-feather-alt text-[#8b1a1a]/70 dark:text-[#c9a227]/70"></i> By {author}
          </span>
        </div>

        {/* Short Summary */}
        <p className="text-[#5c3d2e] text-sm leading-relaxed mb-5 flex-grow font-[EB_Garamond] dark:text-[#d4b896]">
          {summary}
        </p>

        {/* Key Themes */}
        <div className="mb-6">
          <span className="text-[10px] font-bold text-[#8b1a1a] uppercase tracking-wider block mb-2 font-[Cormorant_Garamond] dark:text-[#c9a227]">
            Core Themes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {themes.map((theme, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded bg-[#fdf8f0] text-[#5c3d2e] border border-[#d4b896] font-semibold hover:bg-[#e8d5b0] transition-colors duration-300 dark:bg-[#1a0f08] dark:text-[#d4b896] dark:border-[#5c3d2e] font-[Cormorant_Garamond]"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Inspiration Prompts Selector */}
        <div className="mb-6 border-t border-[#d4b896]/40 pt-4 dark:border-[#5c3d2e]/40">
          <span className="text-[10px] font-bold text-[#8b1a1a] uppercase tracking-wider block mb-3 font-[Cormorant_Garamond] dark:text-[#c9a227]">
            Choose an Inspiration Prompt
          </span>
          <div className="space-y-2">
            {prompts.map((prompt, i) => (
              <div
                key={i}
                onClick={() => setSelectedPromptIdx(i)}
                className={`p-3 rounded-lg border text-xs leading-relaxed cursor-pointer font-[EB_Garamond] transition-all duration-300 ${
                  selectedPromptIdx === i
                    ? "bg-[#fdf8f0] border-[#8b1a1a] text-[#8b1a1a] shadow-sm font-semibold dark:bg-[#1a0f08] dark:border-[#c9a227] dark:text-[#c9a227]"
                    : "bg-[#fdf8f0]/40 border-[#d4b896]/60 text-[#5c3d2e] hover:bg-[#e8d5b0] hover:text-[#2c1810] dark:bg-[#1a0f08]/40 dark:border-[#5c3d2e]/60 dark:text-[#d4b896] dark:hover:bg-[#2c1810] dark:hover:text-[#f5ead6]"
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <span className={`text-[10px] font-bold font-[Cormorant_Garamond] px-1.5 py-0.5 rounded shrink-0 ${
                    selectedPromptIdx === i ? "bg-[#8b1a1a] text-white" : "bg-[#d4b896] text-[#5c3d2e] dark:bg-[#5c3d2e] dark:text-[#d4b896]"
                  }`}>
                    0{i + 1}
                  </span>
                  <p>{prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate CTA Button */}
        <button
          onClick={handleGenerateSimilar}
          className="parchment-btn-primary w-full mt-auto py-3.5 flex items-center justify-center gap-2 group/btn shadow-md font-[Cormorant_Garamond] text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:scale-[1.02]"
        >
          <span>Generate Similar Story</span>
          <i className="motion-icon fas fa-wand-magic-sparkles text-sm"></i>
        </button>

      </div>
    </div>
  );
};

export default StoryInspirationCard;
