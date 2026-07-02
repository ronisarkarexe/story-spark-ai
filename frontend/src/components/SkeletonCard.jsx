import React from 'react';
import '../styles/skeleton.css'; // Adjust path based on your styling folder setup

const SkeletonCard = () => {
  return (
    <div 
      className="skeleton-card" 
      aria-hidden="true"
    >
      {/* 1. Placeholder Rectangle for the Story Image (Aspect Ratio 16:9) */}
      <div className="shimmer-anim w-full aspect-video rounded-xl" />

      {/* Card Content Stack */}
      <div className="flex flex-col gap-3 mt-2 w-full">
        {/* 2. Short bar for Title (~70% width) */}
        <div className="shimmer-anim h-5 w-[70%] rounded-md" />

        {/* 3. Shorter bar for Author Name (~40% width) */}
        <div className="shimmer-anim h-3 w-[40%] rounded-md" />

        {/* 4. Longer bars for Description Excerpt */}
        <div className="space-y-1.5 mt-1">
          <div className="shimmer-anim h-3.5 w-full rounded-md" />
          <div className="shimmer-anim h-3.5 w-[90%] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
