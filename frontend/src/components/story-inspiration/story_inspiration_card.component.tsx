import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageFallback from "../ImageFallback";
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
    <div className="motion-card group relative bg-white border border-gray-100 hover:border-indigo-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full transition-all duration-300 dark:bg-slate-900/50 dark:border-none dark:shadow-xl">
      
      {/* Zoom-in Card Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-[#0A0E17]">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/50 to-transparent z-10 pointer-events-none dark:from-[#0B0F19] dark:via-[#0B0F19]/50 dark:to-transparent" />
        <ImageFallback
            src={image}
            alt={title}
            className="motion-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Genre tag */}
        <div className={`absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full backdrop-blur-md border bg-gray-100 text-slate-700 border-gray-200 text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${genreBadgeClasses[genre] || "dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-300"}`}>
          <i className={`${config.icon} text-xs`}></i>
          {genre}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow relative z-20 -mt-8 bg-white dark:bg-transparent">
        
        {/* Title and Author */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 tracking-tight leading-snug dark:text-white dark:group-hover:text-indigo-400">
            {title}
          </h3>
          <span className="text-sm text-slate-700 flex items-center gap-1.5 font-medium mt-2 dark:text-slate-300">
            <i className="fas fa-feather-alt text-indigo-500/70"></i> By {author}
          </span>
        </div>

        {/* Short Summary */}
        <p className="text-slate-800 text-base leading-relaxed mb-6 flex-grow font-normal dark:text-slate-200">
          {summary}
        </p>

        {/* Key Themes */}
        <div className="mb-7">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-3 font-mono dark:text-indigo-400">
            Core Themes
          </span>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-slate-800 border border-gray-300 font-medium hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-colors duration-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Inspiration Prompts Selector */}
        <div className="mb-8 border-t border-gray-200 pt-5 dark:border-white/10">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-4 font-mono dark:text-indigo-400">
            Choose an Inspiration Prompt
          </span>
          <div className="space-y-3">
            {prompts.map((prompt, i) => (
              <div
                key={i}
                onClick={() => setSelectedPromptIdx(i)}
                className={`motion-card-subtle p-3.5 rounded-lg border text-sm leading-relaxed cursor-pointer transition-all duration-200 ${
                  selectedPromptIdx === i
                    ? "bg-indigo-50 border-indigo-400 text-indigo-950 shadow-md dark:bg-indigo-500/20 dark:border-indigo-400/50 dark:text-indigo-100"
                    : "bg-gray-50 border-gray-300 text-slate-700 hover:bg-gray-100 hover:border-gray-400 hover:text-slate-900 dark:bg-white/[0.02] dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-md shrink-0 mt-0.5 ${
                    selectedPromptIdx === i ? "bg-indigo-600 text-white dark:bg-indigo-500" : "bg-gray-200 text-slate-700 dark:bg-white/10 dark:text-gray-300"
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
          className="motion-cta w-full mt-auto py-4 rounded-xl bg-purple-100 text-purple-950 border border-purple-300 hover:bg-purple-200 hover:border-purple-400 text-base font-bold flex items-center justify-center gap-2.5 group/btn shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-lg hover:shadow-indigo-500/15 transition-all duration-300 dark:bg-gradient-to-r dark:from-blue-600/90 dark:to-indigo-600/90 dark:text-white dark:border-white/10 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:hover:border-indigo-300/40 dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] dark:hover:shadow-indigo-500/30"
        >
          <span>Generate Similar Story</span>
          <i className="motion-icon fas fa-wand-magic-sparkles text-base group-hover/btn:translate-x-1 group-hover/btn:rotate-12"></i>
        </button>

      </div>
    </div>
  );
};

export default StoryInspirationCard;
