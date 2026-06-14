import React from "react";

const CommunitySpotlightSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-700/40 p-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-slate-700" />
          <div>
            <div className="h-4 w-28 rounded bg-slate-700 mb-2" />
            <div className="h-3 w-20 rounded bg-slate-800" />
          </div>
        </div>

        <div className="h-8 w-10 rounded-full bg-slate-700" />
      </div>

      <div className="mb-5 rounded-xl border border-slate-700/40 p-4">
        <div className="h-3 w-20 rounded bg-slate-800 mb-3" />
        <div className="h-4 w-full rounded bg-slate-700 mb-2" />
        <div className="h-4 w-3/4 rounded bg-slate-700" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 rounded-xl bg-slate-700" />
        <div className="h-16 rounded-xl bg-slate-700" />
        <div className="h-16 rounded-xl bg-slate-700" />
        <div className="h-16 rounded-xl bg-slate-700" />
      </div>
    </div>
  );
};

export default CommunitySpotlightSkeleton;