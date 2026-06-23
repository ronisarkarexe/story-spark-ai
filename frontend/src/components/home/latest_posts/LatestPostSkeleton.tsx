import React from "react";

const LatestPostSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg overflow-hidden border border-slate-700/30 bg-[#252b3d]/40">
      <div className="p-4">
        <div className="h-6 w-3/4 rounded bg-slate-600" />
      </div>

      <div className="border-t border-slate-700/30 p-5">
        <div className="h-4 w-full rounded bg-slate-700 mb-3" />
        <div className="h-4 w-5/6 rounded bg-slate-700 mb-3" />
        <div className="h-4 w-2/3 rounded bg-slate-700 mb-4" />

        <div className="flex justify-end">
          <div className="h-8 w-28 rounded bg-slate-600" />
        </div>
      </div>
    </div>
  );
};

export default LatestPostSkeleton;