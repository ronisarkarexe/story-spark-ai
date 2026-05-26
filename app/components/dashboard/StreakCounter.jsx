import React, { useMemo } from "react";
import { Award } from "lucide-react";

function StreakCounter({ activityDates }) {
  const { currentStreak, highestStreak } = useMemo(() => {
    if (!activityDates || activityDates.length === 0) {
      return { currentStreak: 0, highestStreak: 0 };
    }

    const toLocalStr = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const uniqueSortedDates = [...new Set(
      activityDates.map((date) => {
        const localDate = new Date(date);
        localDate.setHours(0, 0, 0, 0);
        return toLocalStr(localDate);
      })
    )].sort();

    let highest = 1;
    let tempStreak = 1;
    for (let i = 1; i < uniqueSortedDates.length; i++) {
      const prev = new Date(uniqueSortedDates[i - 1] + "T00:00:00");
      const curr = new Date(uniqueSortedDates[i] + "T00:00:00");

      const diff = Math.round(
        (curr - prev) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) tempStreak++;
      else tempStreak = 1;
      if (tempStreak > highest) highest = tempStreak;
    }

    let streakCount = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    for (let i = uniqueSortedDates.length - 1; i >= 0; i--) {
      if (uniqueSortedDates[i] === toLocalStr(checkDate)) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }

    return { currentStreak: streakCount, highestStreak: highest };
  }, [activityDates]);

  return (
    <main className="md:p-12 p-4">
      <div className="flex flex-col items-center space-y-2">
        {/* Circle with fire icon and current streak */}
        <div className="w-24 h-24 rounded-full border-4 border-orange-500 flex flex-col items-center justify-center shadow-lg relative">
          <span className="text-3xl">
            <img src="/assets/fire.svg" className="w-10 h-10" alt="fire" />
          </span>
          <span className="text-xl font-bold text-surface-800 dark:text-surface-200">
            {currentStreak}
          </span>
        </div>

        {/* Highest streak label */}
        <div className="text-sm text-surface-600 dark:text-surface-300 flex items-center gap-1">
          <Award size={24} color="#ff9300" />Highest: {highestStreak} day{highestStreak !== 1 ? "s" : ""}
        </div>
      </div>
    </main>
  );
}

export default StreakCounter;