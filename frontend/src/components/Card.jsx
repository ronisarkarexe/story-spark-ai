import React from "react";

const SkeletonCard = () => {
  return (
    <div 
      className="story-skeleton-shell flex flex-col gap-4 p-5 rounded-2xl w-full box-border" 
      aria-hidden="true"
    >
      {/* 1. Image Placeholder Rectangle (Aspect Ratio 16:9) */}
      <div className="shimmer-loader animate-shimmer w-full aspect-video rounded-xl" />

      {/* 2. Text Content Alignments Stack */}
      <div className="flex flex-col gap-3 w-full mt-1">
        {/* Short Title Bar (~70% Width) */}
        <div className="shimmer-loader animate-shimmer h-5 w-[70%] rounded-md" />

        {/* Shorter Author Line (~40% Width) */}
        <div className="shimmer-loader animate-shimmer h-3.5 w-[40%] rounded-md" />

        {/* Multi-line Description Body Excerpt Placements */}
        <div className="space-y-2 mt-2">
          <div className="shimmer-loader animate-shimmer h-3 w-full rounded-md" />
          <div className="shimmer-loader animate-shimmer h-3 w-[92%] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
