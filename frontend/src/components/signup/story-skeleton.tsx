import React from "react";

const StorySkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm animate-pulse relative overflow-hidden box-border">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none select-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none select-none"></div>

      <div className="flex items-center gap-4 mb-8 relative z-10 w-full box-border">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
        <div className="space-y-2.5 min-w-0 flex-1">
          <div className="h-4.5 w-2/3 max-w-[224px] bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="h-3 w-1/2 max-w-[144px] bg-slate-100 dark:bg-slate-800/60 rounded-md"></div>
        </div>
      </div>

      <div className="space-y-4 relative z-10 w-full box-border">
        <div className="h-3.5 w-full bg-slate-200/80 dark:bg-slate-800/70 rounded-md"></div>
        <div className="h-3.5 w-[96%] bg-slate-200/80 dark:bg-slate-800/70 rounded-md"></div>
        <div className="h-3.5 w-[92%] bg-slate-200/80 dark:bg-slate-800/70 rounded-md"></div>
        <div className="h-3.5 w-[98%] bg-slate-200/80 dark:bg-slate-800/70 rounded-md"></div>
        <div className="h-3.5 w-[85%] bg-slate-200/80 dark:bg-slate-800/70 rounded-md"></div>
        
        <div className="h-3.5 w-[94%] bg-slate-200/80 dark:bg-slate-800/70 rounded-md pt-4 box-content"></div>
        <div className="h-3.5 w-[88%] bg-slate-200/80 dark:bg-slate-800/70 rounded-md"></div>
        <div className="h-3.5 w-[75%] bg-slate-200/80 dark:bg-slate-800/70 rounded-md"></div>
      </div>
    </div>
  );
};

export default StorySkeleton;