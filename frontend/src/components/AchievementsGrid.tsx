import React, { useState, useMemo } from "react";
import { Achievement } from "../types";
import AchievementBadge from "./AchievementBadge";

interface AchievementsGridProps {
  achievements?: Achievement[];
  isLoading?: boolean;
}

type CategoryFilter = "all" | "streak" | "story" | "word_count" | "productivity";

const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  achievements = [],
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: "All Achievements", value: "all" },
    { label: "Streaks", value: "streak" },
    { label: "Stories", value: "story" },
    { label: "Word Count", value: "word_count" },
    { label: "Productivity", value: "productivity" },
  ];

  // Helper to resolve categories based on ID prefix
  const getCategoryFromId = (id: string): string => {
    if (id.startsWith("streak_")) return "streak";
    if (id.startsWith("story_")) return "story";
    if (id.startsWith("words_")) return "word_count";
    if (id.startsWith("productivity_")) return "productivity";
    return "other";
  };

  const filteredAchievements = useMemo(() => {
    if (activeTab === "all") return achievements;
    return achievements.filter(
      (ach) => getCategoryFromId(ach.id) === activeTab
    );
  }, [achievements, activeTab]);

  const { unlockedCount, totalCount } = useMemo(() => {
    const total = achievements.length;
    const unlocked = achievements.filter((ach) => !!ach.unlockedAt).length;
    return { unlockedCount: unlocked, totalCount: total };
  }, [achievements]);

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/50 p-12 text-center">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No achievements found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Check back later or start writing to trigger them!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Tab filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div 
          className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05]"
          role="tablist"
          aria-label="Filter Achievements by Category"
        >
          {categories.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              aria-controls="achievements-panel"
              id={`tab-${tab.value}`}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.value
                  ? "bg-white text-slate-900 shadow-sm dark:bg-white/[0.1] dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Progress overview */}
        <div className="text-sm font-bold text-slate-600 dark:text-slate-300 self-end sm:self-center">
          🏆 Total Unlocked:{" "}
          <span className="text-yellow-600 dark:text-yellow-400">
            {unlockedCount} / {totalCount}
          </span>
        </div>
      </div>

      {/* Grid of Badges */}
      <div 
        id="achievements-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {filteredAchievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsGrid;
