import React, { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../redux/store";

import ChapterSidebar from "./ChapterSidebar";
import StoryViewer from "./StoryViewer";
import ContinueStoryButton from "./ContinueStoryButton";
import ConsistencyDashboard from "../ConsistencyDashboard/ConsistencyDashboard";

const StoryWorkspace = () => {
  const [showGuardian, setShowGuardian] = useState(false);
  const currentStory = useSelector(
    (state: RootState) => state.story.currentStory
  );

  if (!currentStory) {
    return (
      <div className="text-white p-10">
        No Story Available
      </div>
    );
  }

  return (
    <div className="flex bg-black h-screen">
      <ChapterSidebar
        chapters={currentStory.chapters}
      />

      <div className="flex flex-col flex-1 relative">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900">
          <h2 className="text-white text-lg font-bold">{currentStory.title}</h2>
          <button
            onClick={() => setShowGuardian(!showGuardian)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
          >
            {showGuardian ? "Close Guardian" : "Story Guardian"}
          </button>
        </div>

        <StoryViewer
          chapters={currentStory.chapters}
        />

        <div className="p-6 border-t border-zinc-800">
          <ContinueStoryButton />
        </div>

        {showGuardian && (
          <div className="absolute top-0 right-0 h-full w-[450px] bg-zinc-900 border-l border-zinc-700 overflow-y-auto shadow-2xl z-50">
            <ConsistencyDashboard postId={currentStory.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryWorkspace;