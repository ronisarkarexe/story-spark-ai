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
    <div className="group relative bg-[#0B0F19]/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1.5">
      
      {/* Zoom-in Card Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-[#0A0E17]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent z-10 pointer-events-none" />
        <img
          src={image}
          alt={title}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Genre tag */}
        <div className={`absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full backdrop-blur-md border ${config.bg} ${config.border} ${config.color} text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5`}>
          <i className={`${config.icon} text-xs`}></i>
          {genre}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow relative z-20 -mt-8">
        
        {/* Title and Author */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-100 group-hover:text-indigo-400 transition-colors duration-300 tracking-tight leading-snug">
            {title}
          </h3>
          <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium mt-1">
            <i className="fas fa-feather-alt text-indigo-400/70"></i> By {author}
          </span>
        </div>

        {/* Short Summary */}
        <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-grow font-light">
          {summary}
        </p>

        {/* Key Themes */}
        <div className="mb-6">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-2 font-mono">
            Core Themes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {themes.map((theme, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300 font-medium hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-colors duration-300"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Inspiration Prompts Selector */}
        <div className="mb-6 border-t border-white/5 pt-4">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-3 font-mono">
            Choose an Inspiration Prompt
          </span>
          <div className="space-y-2">
            {prompts.map((prompt, i) => (
              <div
                key={i}
                onClick={() => setSelectedPromptIdx(i)}
                className={`p-3 rounded-lg border text-xs leading-relaxed transition-all duration-300 cursor-pointer ${
                  selectedPromptIdx === i
                    ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-200 shadow-sm"
                    : "bg-white/[0.01] border-white/5 text-gray-400 hover:bg-white/[0.03] hover:text-gray-300"
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    selectedPromptIdx === i ? "bg-indigo-500 text-white" : "bg-white/10 text-gray-400"
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
          className="w-full mt-auto py-3.5 rounded-xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 border border-white/10 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-indigo-500/20"
        >
          <span>Generate Similar Story</span>
          <i className="fas fa-wand-magic-sparkles text-sm transform group-hover/btn:translate-x-0.5 group-hover/btn:rotate-12 transition-all duration-300"></i>
        </button>

      </div>
    </div>
  );
};

export default StoryInspirationCard;
