import React, { useState } from "react";
import { User } from "../../../models/user";

interface WritingGoalsProps {
  user: User;
  onSave: (data: Partial<User>) => void;
  loading: boolean;
}

export const WritingGoalsForm = ({ user, onSave, loading }: WritingGoalsProps) => {
  const [dailyGoal, setDailyGoal] = useState<number>(user.writingGoals?.dailyWordCount ?? 0);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(user.writingGoals?.weeklyWordCount ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      writingGoals: {
        dailyWordCount: Number(dailyGoal),
        weeklyWordCount: Number(weeklyGoal),
      },
    });
  };

  const inputClassName =
    "w-full px-4 py-2 border border-slate-350 rounded-lg bg-white !text-black font-medium dark:bg-slate-900/70 dark:!text-white dark:border-slate-700/50 !placeholder-gray-650 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-lg dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="bg-indigo-600 px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-white">Writing Goals</h2>
          <p className="text-indigo-200 mt-1">
            Set word count goals to stay motivated and track your writing habit!
          </p>
        </div>

        <div className="p-6 md:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label
                  htmlFor="dailyGoal"
                  className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                >
                  Daily Word Count Goal
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="number"
                    id="dailyGoal"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Math.max(0, parseInt(e.target.value) || 0))}
                    className={inputClassName}
                    min="0"
                    placeholder="e.g. 500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">words</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Recommended: 300 - 500 words per day for beginners.
                </p>
              </div>

              <div>
                <label
                  htmlFor="weeklyGoal"
                  className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                >
                  Weekly Word Count Goal
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="number"
                    id="weeklyGoal"
                    value={weeklyGoal}
                    onChange={(e) => setWeeklyGoal(Math.max(0, parseInt(e.target.value) || 0))}
                    className={inputClassName}
                    min="0"
                    placeholder="e.g. 2500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">words</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Recommended: 1500 - 3000 words per week.
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-3">Goal Presets</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDailyGoal(300);
                    setWeeklyGoal(1500);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-250 transition"
                >
                  📝 Casual Writer (300 / day)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDailyGoal(500);
                    setWeeklyGoal(2500);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-250 transition"
                >
                  🚀 Active Storyteller (500 / day)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDailyGoal(1000);
                    setWeeklyGoal(5000);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-250 transition"
                >
                  🔥 Dedicated Novelist (1000 / day)
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-650 rounded-lg text-white font-bold hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                {loading ? "Saving..." : "Save Goals"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
