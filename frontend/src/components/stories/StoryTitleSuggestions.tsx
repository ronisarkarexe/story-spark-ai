import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { generateTitleSuggestions } from "./titleSuggestions.utils";

interface Props {
  content: string;
  tag: string;
  onApply: (title: string) => void;
}

const StoryTitleSuggestions: React.FC<Props> = ({
  content,
  tag,
  onApply,
}) => {
  const [titles, setTitles] = useState<string[]>([]);

  // Generate titles when story changes
  useEffect(() => {
    setTitles(generateTitleSuggestions(content, tag));
  }, [content, tag]);

  // Regenerate new titles
  const handleRegenerate = () => {
    setTitles(generateTitleSuggestions(content, tag));
    toast.success("New title suggestions generated!");
  };

  // Copy title
  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(title).catch(() => {});
    toast.success("Title copied!");
  };

  // Apply title to story
  const handleApply = (title: string) => {
    onApply(title);
    toast.success("Title applied successfully!");
  };

  return (
    <div className="mt-6 bg-slate-800/60 border border-slate-700 rounded-2xl p-5 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4">
        ✨ AI Title Suggestions
      </h3>

      <div className="space-y-3">
        {titles.map((title, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/70 rounded-xl p-3"
          >
            <span className="text-slate-200 font-medium">
              {index + 1}. {title}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(title)}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
              >
                📋 Copy
              </button>

              <button
                onClick={() => handleApply(title)}
                className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm"
              >
                ✅ Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleRegenerate}
        className="mt-5 w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
      >
        🔄 Generate New Titles
      </button>
    </div>
  );
};

export default StoryTitleSuggestions;