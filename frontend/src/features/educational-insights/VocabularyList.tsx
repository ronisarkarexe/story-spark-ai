import React from "react";
import { MessageSquare } from "lucide-react";
import { IVocabularyItem } from "../../services/educational-insights.service";

interface VocabularyListProps {
  vocabulary: IVocabularyItem[];
}

export const VocabularyList: React.FC<VocabularyListProps> = ({
  vocabulary,
}) => {
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">No vocabulary words generated.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vocabulary.map((item, idx) => (
        <div
          key={idx}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 transition hover:border-indigo-500/30 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20">
                Word
              </span>
              <h4 className="text-white font-bold text-lg capitalize">
                {item.word}
              </h4>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-3">
              {item.definition}
            </p>
          </div>
          {item.example && (
            <div className="bg-zinc-950/60 rounded-lg p-2.5 border border-zinc-800/40 flex gap-2 items-start mt-2">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400/70 shrink-0 mt-1" />
              <p className="text-zinc-400 text-xs italic leading-normal">
                "{item.example}"
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VocabularyList;
