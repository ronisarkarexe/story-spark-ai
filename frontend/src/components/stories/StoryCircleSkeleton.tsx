import React from "react";

const StoryCircleSkeleton = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
      <div className="mt-2 h-3 w-12 rounded bg-slate-300" />
    </div>
  );
};

export default StoryCircleSkeleton;