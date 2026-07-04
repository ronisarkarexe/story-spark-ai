import React from "react";

export interface IStories {
  uuid?: string;
  title?: string;
  content?: string;
  tag?: string;
  emotions?: string[];
  enhancedPrompt?: string;
  imageURL?: string;
  language?: string;
  genre?: string;
}

interface StoriesComponentProps {
  stories?: IStories[];
  isLogin?: boolean;
  setStories?: (stories: IStories[]) => void;
  onPublishSuccess?: () => void;
}

const StoriesComponent: React.FC<StoriesComponentProps> = ({ stories = [] }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Stories</h2>
      <div className="mt-2 space-y-2">
        {stories.length === 0 && <div className="text-sm text-gray-500">No stories available</div>}
        {stories.map((s, idx) => (
          <div key={s.uuid ?? idx} className="border rounded p-2">
            <div className="font-medium">{s.title ?? "Untitled"}</div>
            <div className="text-sm text-gray-600">{s.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesComponent;
