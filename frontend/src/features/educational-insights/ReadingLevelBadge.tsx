import React from "react";
import { BookOpen, HelpCircle } from "lucide-react";
import { IReadingLevel } from "../../services/educational-insights.service";

interface ReadingLevelBadgeProps {
  readingLevel: IReadingLevel;
}

export const ReadingLevelBadge: React.FC<ReadingLevelBadgeProps> = ({
  readingLevel,
}) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:border-zinc-700">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-600/10 rounded-lg text-indigo-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Reading Level Estimate
          </h4>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-white text-2xl font-bold tracking-tight">
              {readingLevel.gradeLevel}
            </span>
            <span className="text-zinc-500 text-sm">
              ({readingLevel.ageRange})
            </span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto max-w-md bg-zinc-950/50 border border-zinc-800/60 rounded-lg p-3 text-xs text-zinc-400 leading-relaxed flex gap-2">
        <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <span>{readingLevel.explanation}</span>
      </div>
    </div>
  );
};

export default ReadingLevelBadge;
