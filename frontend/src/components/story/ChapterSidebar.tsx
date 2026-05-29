import React from "react";
import { Chapter } from "../../types/story.types";

interface Props {
  chapters: Chapter[];
}

const ChapterSidebar: React.FC<Props> = ({
  chapters,
}) => {
  return (
    <div className="w-72 bg-zinc-900 h-screen border-r border-zinc-800 p-5">
      <h2 className="text-2xl font-bold text-white mb-6">
        Chapters
      </h2>

      <div className="space-y-3">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="bg-zinc-800 p-4 rounded-xl"
          >
            <p className="text-white font-semibold">
              {chapter.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterSidebar;