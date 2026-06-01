import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageFallback from "../ImageFallback";
ImageFallback
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
    <div className="motion-card group relative bg-white border border-gray-100 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full transition-colors duration-300 dark:bg-slate-900/50 dark:border-none dark:shadow-xl">
      
      {/* Zoom-in Card Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-[#0A0E17]">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/50 to-transparent z-10 pointer-events-none dark:from-[#0B0F19] dark:via-[#0B0F19]/50 dark:to-transparent" />
        <ImageFallback
            src={image}
            alt={title}
            className="motion-image w-full h-full object-cover"
        />
        
        {/* Genre tag */}
        <div className={`absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full backdrop-blur-md border bg-gray-100 text-slate-700 border-gray-200 text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 ${genreBadgeClasses[genre] || "dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-300"}`}>
          <i className={`${config.icon} text-xs`}></i>
          {genre}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow relative z-20 -mt-8 bg-white dark:bg-transparent">
        
        {/* Title and Author */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-500 transition-colors duration-300 tracking-tight leading-snug dark:text-white dark:group-hover:text-indigo-400">
            {title}
          </h3>
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mt-1 dark:text-slate-400">
            <i className="fas fa-feather-alt text-indigo-400/70"></i> By {author}
          </span>
        </div>

        {/* Short Summary */}
        <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-grow font-light dark:text-slate-300">
          {summary}
        </p>

        {/* Key Themes */}
        <div className="mb-6">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-2 font-mono dark:text-indigo-400">
            Core Themes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {themes.map((theme, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-slate-700 border border-gray-200 font-medium hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-colors duration-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Inspiration Prompts Selector */}
        <div className="mb-6 border-t border-gray-200 pt-4 dark:border-white/5">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-3 font-mono dark:text-indigo-400">
            Choose an Inspiration Prompt
          </span>
          <div className="space-y-2">
            {prompts.map((prompt, i) => (
              <div
                key={i}
                onClick={() => setSelectedPromptIdx(i)}
                className={`motion-card-subtle p-3 rounded-lg border text-xs leading-relaxed cursor-pointer ${
                  selectedPromptIdx === i
                    ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-900 shadow-sm dark:text-indigo-200"
                    : "bg-gray-50 border-gray-200 text-slate-600 hover:bg-gray-100 hover:text-slate-900 dark:bg-white/[0.01] dark:border-white/5 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    selectedPromptIdx === i ? "bg-indigo-500 text-white" : "bg-gray-200 text-slate-600 dark:bg-white/10 dark:text-gray-400"
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
          className="motion-cta w-full mt-auto py-3.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 hover:border-purple-300 font-semibold flex items-center justify-center gap-2 group/btn shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-lg hover:shadow-indigo-500/15 transition-colors duration-300 dark:bg-gradient-to-r dark:from-blue-600/80 dark:to-indigo-600/80 dark:text-white dark:border-white/10 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:hover:border-indigo-300/30 dark:shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:hover:shadow-indigo-500/25"
        >
          <span>Generate Similar Story</span>
          <i className="motion-icon fas fa-wand-magic-sparkles text-sm group-hover/btn:translate-x-0.5 group-hover/btn:rotate-12"></i>
        </button>

      </div>
    </div>
  );
};

export default StoryInspirationCard;
