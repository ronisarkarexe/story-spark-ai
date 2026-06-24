import React from "react";
import { Link } from "react-router-dom";

const EmptyStoriesState: React.FC = () => {
  return (
    <div className="w-full min-h-[320px] flex items-center justify-center px-4 sm:px-6">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/70 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden dark:border-white/10 dark:bg-[#0b1329]/40">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-purple-500/15 blur-2xl pointer-events-none" />

        <div className="relative p-7 sm:p-10">
          <div className="flex flex-col items-center text-center">
            {/* Storytelling illustration */}
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-slate-200/60 dark:border-white/10 flex items-center justify-center shadow-sm">
              <span className="text-3xl" aria-hidden>
                📖✨
              </span>
              <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-indigo-500/20 blur-sm pointer-events-none" />
            </div>

            <h2 className="mt-5 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              No stories yet. Start your creative journey today!
            </h2>
            <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Pick a prompt, let the magic happen, and your first story will appear here.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Link
                to="/story-workspace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-bold shadow-md shadow-blue-500/10 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 active:scale-[0.99]"
              >
                <span aria-hidden>🪄</span>
                Generate Your First Story
              </Link>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Tip: a great prompt starts with a vibe + a character.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyStoriesState;


