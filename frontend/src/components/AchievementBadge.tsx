import React from "react";
import { Achievement } from "../types";
import AchievementProgress from "./AchievementProgress";

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const { title, description, icon, unlockedAt, progress, target } = achievement;
  const isUnlocked = !!unlockedAt;

  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      tabIndex={0}
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isUnlocked
          ? "border-yellow-100 bg-gradient-to-br from-yellow-50/20 via-white to-amber-50/10 shadow-md hover:shadow-lg dark:border-yellow-500/10 dark:from-yellow-500/5 dark:via-transparent dark:to-amber-500/5"
          : "border-slate-200 bg-white/40 opacity-70 hover:opacity-90 dark:border-white/[0.06] dark:bg-white/[0.01]"
      }`}
      role="article"
      aria-label={`${isUnlocked ? "Unlocked" : "Locked"} Achievement: ${title}`}
    >
      <div className="flex items-start gap-4">
        {/* Badge Icon container */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm transition-transform group-hover:rotate-12 ${
            isUnlocked
              ? "bg-gradient-to-tr from-yellow-400 to-amber-300 text-slate-900"
              : "bg-slate-100 text-slate-400 dark:bg-white/[0.05]"
          }`}
          aria-hidden="true"
        >
          {isUnlocked ? icon : "🔒"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
              {title}
            </h4>
            {isUnlocked && (
              <span 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30"
                aria-label="Unlocked Badge"
              >
                🏆 Unlocked
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.05]">
        {!isUnlocked ? (
          <AchievementProgress progress={progress} target={target} label="Goal Progress" />
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Unlocked on:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200" aria-label={`Unlocked date ${formattedDate}`}>
              {formattedDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;
