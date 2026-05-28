import React from "react";

interface GamificationData {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

const GamificationCard: React.FC<{ data?: GamificationData }> = ({ data }) => {
  if (!data) return null;

  const { xp, level, streak, badges } = data;

  const currentLevelXp = Math.pow(level - 1, 2) * 100;
  const nextLevelXp = Math.pow(level, 2) * 100;
  const progressPercent = Math.min(100, Math.max(0, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-6 dark:border-blue-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20 mb-2">
            <span className="font-black text-xl">Lvl {level}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Progress</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{xp} / {nextLevelXp} XP</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-500/20">
          <span className="text-orange-500 text-lg animate-pulse">🔥</span>
          <span className="text-xs font-black text-orange-600 dark:text-orange-400">{streak} Day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="text-blue-600 dark:text-blue-400">Current Lvl</span>
          <span className="text-slate-400">Next Lvl</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-white/[0.05] h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBsNDAtNDBIMzBMMCAzMHYxMHptNDAgMEw0MCAwSDBMMCA0MGg0MHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50"></div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Badges</h4>
        <div className="flex flex-wrap gap-2">
          {badges.length > 0 ? (
            badges.map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full border border-yellow-200 dark:border-yellow-500/30 flex items-center gap-1">
                <i className="fas fa-medal"></i> {badge}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">No badges yet. Write your first story!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationCard;
