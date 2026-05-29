import React from "react";
import { Chapter } from "../../types/story.types";

interface Props {
  chapters: Chapter[];
}

const StoryViewer: React.FC<Props> = ({
  chapters,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">
            {chapter.title}
          </h1>

          <p className="text-zinc-300 whitespace-pre-line leading-8">
            {chapter.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StoryViewer;