import React, { useMemo } from "react";
import { Achievement } from "../types";
import AchievementProgress from "./AchievementProgress";

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const {
    title,
    description,
    icon,
    unlockedAt,
    progress,
    target,
  } = achievement;

  const isUnlocked = Boolean(unlockedAt);

  const formattedDate = useMemo(() => {
    if (!unlockedAt) return null;

    return new Date(unlockedAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [unlockedAt]);

  const cardClasses = isUnlocked
    ? "completed-badge border-yellow-100 bg-gradient-to-br from-yellow-50/20 via-white to-amber-50/10 shadow-md dark:border-yellow-500/10 dark:from-yellow-500/5 dark:via-transparent dark:to-amber-500/5"
    : "border-slate-200 bg-white/40 opacity-70 hover:opacity-90 hover:scale-[1.02] hover:shadow-sm dark:border-white/[0.06] dark:bg-white/[0.01]";

  const iconClasses = isUnlocked
    ? "bg-gradient-to-tr from-yellow-400 to-amber-300 text-slate-900"
    : "bg-slate-100 text-slate-400 dark:bg-white/[0.05]";

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`${isUnlocked ? "Unlocked" : "Locked"} Achievement: ${title}`}
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${cardClasses}`}
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm transition-transform group-hover:rotate-12 ${iconClasses}`}
        >
          {isUnlocked ? icon : "🔒"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-bold text-slate-800 dark:text-white">
              {title}
            </h4>

            {isUnlocked && (
              <span
                aria-label="Unlocked Badge"
                className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400"
              >
                🏆 Unlocked
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-3 dark:border-white/[0.05]">
        {isUnlocked ? (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Unlocked on:</span>

            <span
              aria-label={`Unlocked date ${formattedDate}`}
              className="font-bold text-slate-700 dark:text-slate-200"
            >
              {formattedDate}
            </span>
          </div>
        ) : (
          <AchievementProgress
            progress={progress}
            target={target}
            label="Goal Progress"
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(AchievementBadge);