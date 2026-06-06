import React from "react";

interface WritingStatsPanelProps {
  totalStories: number;
  totalWords: number;
  activeDays: number;
  longestStreak: number;
  monthlyActivity?: Record<string, number>;
  isLoading?: boolean;
}

const WritingStatsPanel: React.FC<WritingStatsPanelProps> = ({
  totalStories,
  totalWords,
  activeDays,
  longestStreak,
  monthlyActivity = {},
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" aria-busy="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Stories Created",
      value: totalStories.toLocaleString(),
      icon: "fa-book-open",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      title: "Total Words Written",
      value: totalWords.toLocaleString(),
      icon: "fa-file-signature",
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400",
    },
    {
      title: "Active Writing Days",
      value: activeDays.toLocaleString(),
      icon: "fa-calendar-alt",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      title: "Longest writing streak",
      value: `${longestStreak} Day${longestStreak !== 1 ? "s" : ""}`,
      icon: "fa-bolt",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
    },
  ];

  const sortedMonths = Object.keys(monthlyActivity).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.01]"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
              <i className={`fas ${stat.icon} text-lg`}></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h4 className="text-xl font-black text-slate-800 dark:text-white mt-1">
                {stat.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Activity Summary */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.01]">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Monthly Activity Summary
        </h3>

        {sortedMonths.length > 0 ? (
          <div className="space-y-3">
            {sortedMonths.map((month) => {
              const count = monthlyActivity[month];
              return (
                <div
                  key={month}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📈</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {new Date(`${month}-02`).toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                    {count} Stor{count === 1 ? "y" : "ies"} published
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              No activity logs recorded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingStatsPanel;
