import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

const genreConfig: {
  [key: string]: {
    gradient: string;
    glow: string;
    icon: string;
  };
} = {
  Fantasy: {
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    icon: "fas fa-wand-magic-sparkles",
  },

  Horror: {
    gradient: "from-red-500 to-rose-600",
    glow: "shadow-red-500/20",
    icon: "fas fa-ghost",
  },

  "Sci-Fi": {
    gradient: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-500/20",
    icon: "fas fa-rocket",
  },

  Mystery: {
    gradient: "from-purple-500 to-indigo-600",
    glow: "shadow-purple-500/20",
    icon: "fas fa-user-secret",
  },

  Adventure: {
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
    icon: "fas fa-compass",
  },

  Romance: {
    gradient: "from-pink-500 to-rose-500",
    glow: "shadow-pink-500/20",
    icon: "fas fa-heart",
  },
};

const StoryInspirationCard: React.FC<StoryInspirationCardProps> = ({
  story,
}) => {
  const navigate = useNavigate();

  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);

  const { title, author, genre, summary, themes, prompts, image } = story;

  const config = genreConfig[genre] || {
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/20",
    icon: "fas fa-book",
  };

  const handleGenerateSimilar = () => {
    const selectedPrompt = prompts[selectedPromptIdx];
 const finalPrompt = `
  Write a creative story inspired by
  '${title}' by ${author}.
  Focus on themes:
  ${themes.join(", ")}.
  Premise:
  ${selectedPrompt}
`;
navigate("/stories", {
  state: {
    prompt: finalPrompt,
    genre,
  },
});
};

return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35 }}
      className="
        group relative overflow-hidden
        rounded-[32px]
        bg-white
        border border-slate-200/70
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        hover:shadow-[0_25px_80px_rgba(99,102,241,0.15)]
        transition-all duration-500
        dark:bg-[#0F172A]/80
        dark:border-white/10
        backdrop-blur-xl
      "
    >
      {/* Hover Glow */}
      <div
        className={`
          absolute inset-0 opacity-0
          group-hover:opacity-100
          transition duration-700
          bg-gradient-to-br ${config.gradient}
          blur-3xl
        `}
      />

      {/* Image Section */}
      <div className="relative p-4 pb-0">
        <div className="relative overflow-hidden rounded-[28px] h-60">
          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="
              w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-105
            "
          />

          {/* Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-black/80
              via-black/20
              to-transparent
            "
          />

          {/* Genre Badge */}
          <div
            className="
              absolute top-5 left-5
              px-4 py-2 rounded-full
              bg-black/40 backdrop-blur-xl
              border border-white/10
              text-white text-xs font-semibold
              flex items-center gap-2
            "
          >
            <i className={config.icon}></i>
            {genre}
          </div>

          {/* Bottom Text */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2
              className="
                text-3xl font-black
                text-white tracking-tight
                leading-tight
              "
            >
              {title}
            </h2>

            <div
              className="
                mt-2 flex items-center gap-2
                text-white/70 text-sm
              "
            >
              <i className="fas fa-feather-alt text-indigo-300"></i>
              {author}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-6 pt-5">
        {/* Summary */}
        <p
          className="
            text-[15px] leading-7
            text-slate-600
            dark:text-slate-400
          "
        >
          {summary}
        </p>

        {/* Themes */}
        <div className="mt-7">
          <h3
            className="
              text-xs uppercase tracking-[0.25em]
              font-bold mb-3
              text-slate-500 dark:text-slate-500
            "
          >
            Themes
          </h3>

          <div className="flex flex-wrap gap-2">
            {themes.map((theme, index) => (
              <span
                key={index}
                className="
                  px-3 py-1.5 rounded-full
                  bg-slate-100
                  text-slate-700
                  text-xs font-medium
                  transition-all duration-300
                  hover:bg-indigo-100
                  hover:text-indigo-700
                  dark:bg-white/5
                  dark:text-slate-300
                  dark:hover:bg-indigo-500/10
                  dark:hover:text-indigo-300
                "
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Inspiration Prompts */}
        <div className="mt-8">
          <h3
            className="
              text-xs uppercase tracking-[0.25em]
              font-bold mb-4
              text-slate-500 dark:text-slate-500
            "
          >
            Inspiration Prompt
          </h3>

          <div className="space-y-3">
            {prompts.map((prompt, i) => {
              const active = selectedPromptIdx === i;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedPromptIdx(i)}
                  className={`
                    group/prompt relative w-full
                    text-left rounded-2xl
                    p-4 transition-all duration-300
                    ${
                      active
                        ? `
                          bg-indigo-500/10
                          border border-indigo-500/20
                        `
                        : `
                          bg-slate-50
                          hover:bg-slate-100
                          dark:bg-white/[0.03]
                          dark:hover:bg-white/[0.06]
                        `
                    }
                  `}
                >
                  <div className="flex gap-4">
                    <div
                      className={`
                        shrink-0 w-8 h-8 rounded-xl
                        flex items-center justify-center
                        text-xs font-bold
                        ${
                          active
                            ? `
                              bg-gradient-to-r ${config.gradient}
                              text-white
                            `
                            : `
                              bg-slate-200
                              text-slate-700
                              dark:bg-white/10
                              dark:text-slate-400
                            `
                        }
                      `}
                    >
                      {i + 1}
                    </div>

                    <p
                      className={`
                        text-sm leading-relaxed
                        ${
                          active
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-600 dark:text-slate-400"
                        }
                      `}
                    >
                      {prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGenerateSimilar}
          className={`
            mt-8 w-full
            rounded-2xl py-4
            bg-gradient-to-r ${config.gradient}
            text-white font-semibold
            transition-all duration-300
            hover:scale-[1.02]
            shadow-xl ${config.glow}
            flex items-center justify-center gap-3
          `}
        >
          <span>Generate Similar Story</span>

          <i
            className="
              fas fa-arrow-right
              transition-transform duration-300
              group-hover:translate-x-1
            "
          />
        </button>
      </div>
    </motion.div>
  );
};

export default StoryInspirationCard;
