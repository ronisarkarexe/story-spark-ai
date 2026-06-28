import React from "react";
import StoryTreeView from "./StoryTreeView";

interface StoryTreePanelProps {
  rootStoryId: string;
}

const StoryTreePanel: React.FC<StoryTreePanelProps> = ({ rootStoryId }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1 px-1 text-left">
        <h3 className="text-lg font-bold text-gray-200">AI Story Lineage Graph</h3>
        <p className="text-xs text-gray-550">
          Navigate through the evolutionary tree of this AI story. Click any node to load that snapshot version into the workspace.
        </p>
      </div>
      <StoryTreeView rootStoryId={rootStoryId} />
    </div>
  );
};

export default StoryTreePanel;
