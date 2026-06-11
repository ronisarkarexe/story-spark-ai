import React from "react";
import { PenTool } from "lucide-react";

interface EducationalInsightsCardProps {
  prompts: string[];
}

export const EducationalInsightsCard: React.FC<
  EducationalInsightsCardProps
> = ({ prompts }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-white font-bold text-base flex items-center gap-2">
        <PenTool className="w-5 h-5 text-purple-400" />
        Creative Writing Prompts
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prompts.length === 0 ? (
          <p className="text-zinc-500 text-sm col-span-3">
            No writing prompts generated.
          </p>
        ) : (
          prompts.map((prompt, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 transition hover:border-purple-500/20 hover:bg-zinc-900/60 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider block mb-2">
                  Prompt {idx + 1}
                </span>
                <p className="text-zinc-200 text-sm leading-relaxed">{prompt}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800/40 flex justify-end">
                <span className="text-[10px] text-zinc-500 font-medium">
                  Inspirational Exercise
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EducationalInsightsCard;
