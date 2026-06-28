import React from "react";
import { motion } from "framer-motion";

const SkeletonLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-slate-900/60 dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6"
    >
      {/* Ambient glowing effect */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* AI Thinking / Progress Indicator */}
      <div className="flex flex-col items-center justify-center py-6 text-center z-10">
        <div className="relative w-16 h-16 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 border-t-indigo-500"
          />
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <span className="text-xl">✨</span>
          </motion.div>
        </div>
        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 animate-pulse">
          AI is weaving your story...
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Please wait while StorySparkAI structures characters, plot points, and dialogue.
        </p>
      </div>

      {/* Title skeleton */}
      <div className="flex flex-col gap-2 z-10">
        <div className="h-8 w-3/4 bg-slate-200 dark:bg-white/10 rounded-lg animate-pulse" />
        <div className="h-4 w-1/4 bg-slate-200 dark:bg-white/5 rounded-md animate-pulse" />
      </div>

      {/* Stats details skeleton */}
      <div className="flex gap-4 border-y border-slate-200/50 dark:border-white/5 py-4 z-10">
        <div className="h-6 w-24 bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
        <div className="h-6 w-28 bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
      </div>

      {/* Paragraph blocks skeleton */}
      <div className="flex flex-col gap-4 z-10">
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-11/12 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-11/12 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonLoader;
