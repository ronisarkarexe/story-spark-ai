import React from "react";
import { Chapter } from "../../types/story.types";
import { chapterHeatHue, computeDocumentStats } from "../../utils/story-utils";
import { scrollToChapter } from "../../utils/scroll-to-chapter";

interface Props {
  chapters: Chapter[];
  maxChapterWords: number;
}

const ChapterSidebar: React.FC<Props> = ({ chapters, maxChapterWords }) => {
  return (
    <div className="w-72 bg-zinc-900 p-5 overflow-y-auto flex-1">
      <h2 className="text-2xl font-bold text-white mb-6">Chapters</h2>

      <div className="space-y-3">
        {chapters.map((chapter) => {
          const { totalWords, readingTimeMin } = computeDocumentStats(chapter.content);
          const hue = chapterHeatHue(totalWords, maxChapterWords);
          const widthPct = maxChapterWords === 0 ? 0 : (totalWords / maxChapterWords) * 100;

          return (
            <button
              key={chapter.id}
              onClick={() => scrollToChapter(chapter.id)}
              className="w-full text-left bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl transition-colors group cursor-pointer"
            >
              <p className="text-white font-semibold truncate">{chapter.title}</p>
              <p className="text-xs text-zinc-400 mt-1 tabular-nums">
                {totalWords.toLocaleString()} words · {readingTimeMin} min
              </p>
              <div className="h-1.5 mt-2 rounded-full bg-zinc-700 overflow-hidden">
                <div
                  style={{ width: `${widthPct}%`, "--heat-hue": hue } as React.CSSProperties}
                  className="h-full rounded-full bg-[hsl(var(--heat-hue)_70%_50%)] transition-[width] duration-300 group-hover:opacity-80"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterSidebar;