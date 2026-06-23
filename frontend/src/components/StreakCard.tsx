import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { WritingStreak } from "../types";

interface StreakCardProps {
  streak?: WritingStreak;
  isLoading?: boolean;
}

const StreakCard: React.FC<StreakCardProps> = ({ streak, isLoading }) => {
  useEffect(() => {
    if (isLoading || !streak) return;
    const { currentStreak, totalWritingDays } = streak;
    if (currentStreak === 0) return;

    const streakKey = `${currentStreak}-${totalWritingDays}`;
    const lastCelebrated = localStorage.getItem("last_celebrated_streak");

    let shouldTrigger = false;
    if (!lastCelebrated) {
      shouldTrigger = true;
    } else {
      const parts = lastCelebrated.split("-").map(Number);
      const prevStreak = parts[0];
      const prevTotalDays = parts[1];

      if (Number.isFinite(prevStreak) && Number.isFinite(prevTotalDays)) {
        if (currentStreak > prevStreak || totalWritingDays > prevTotalDays) {
          shouldTrigger = true;
        }
      } else {
        shouldTrigger = true;
        localStorage.removeItem("last_celebrated_streak");
      }
    }

    if (shouldTrigger) {
      // Trigger a beautiful flame/indigo-colored confetti burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#f97316", "#f59e0b", "#eab308", "#6366f1", "#3b82f6"],
      });
    }

    localStorage.setItem("last_celebrated_streak", streakKey);
  }, [streak, isLoading]);

  if (isLoading) {
    return (
      <div 
        className="animate-pulse rounded-2xl border border-orange-100 bg-white/50 p-6 dark:border-orange-500/10 dark:bg-white/[0.02]"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-10 w-24 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  if (!streak) {
    return (
      <div 
        className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 p-6 text-center"
        role="region"
        aria-label="Writing Streak Info"
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">No streak data available.</p>
      </div>
    );
  }

  const { currentStreak, longestStreak, totalWritingDays } = streak;

  return (
    <div 
      className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 p-6 shadow-lg transition-all hover:shadow-xl dark:border-orange-500/10 dark:from-orange-500/5 dark:via-transparent dark:to-amber-500/5"
      role="region"
      aria-label="Writing Streak Tracker"
    >
      {/* Decorative background gradients */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 blur-xl dark:bg-orange-500/20" />

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Writing Streak
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span 
              className="text-4xl font-black text-slate-800 dark:text-white"
              aria-label={`${currentStreak} days current streak`}
            >
              {currentStreak}
            </span>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Days</span>
          </div>
        </div>

        <div 
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20 animate-bounce"
          style={{ animationDuration: "3s" }}
          aria-hidden="true"
        >
          <span className="text-2xl">🔥</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Longest Streak</p>
          <p 
            className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-1"
            aria-label={`${longestStreak} days longest streak`}
          >
            ⚡ {longestStreak} Day{longestStreak !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Writing Days</p>
          <p 
            className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-1"
            aria-label={`${totalWritingDays} total writing days`}
          >
            📅 {totalWritingDays} Day{totalWritingDays !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
