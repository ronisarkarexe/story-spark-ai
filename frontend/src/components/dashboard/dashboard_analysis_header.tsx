import React from "react";
import { DashboardAnalysis } from "../../models/analysis";

const DashboardAnalysisHeader: React.FC<{ data: DashboardAnalysis }> = ({ data }) => {
  const totalSubs =
    (data.subscriptionTypes?.free ?? 0) +
    (data.subscriptionTypes?.pro ?? 0) +
    (data.subscriptionTypes?.premium ?? 0);

  const maxPostCount = Math.max(
    0,
    ...(Object.values(data.posts?.perMonth ?? {}) as number[])
  );

  const topicColors = [
    "bg-blue-50/50 text-blue-600 border-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20",
    "bg-violet-50/50 text-violet-600 border-violet-100 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/20",
    "bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20",
    "bg-amber-50/50 text-amber-600 border-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20",
    "bg-rose-50/50 text-rose-600 border-rose-100 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/20",
    "bg-cyan-50/50 text-cyan-600 border-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/20",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Analysis Overview
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time platform metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-300 font-semibold">
            Live Data
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.03] dark:border-blue-500/15 p-5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mb-1">
                Total Users
              </p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {data.users?.total ?? 0}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/12 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-4 pt-3 border-t border-slate-200 dark:border-white/[0.05]">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-0.5">Active</p>
              <p className="text-sm font-bold text-emerald-500 dark:text-emerald-400">{data.users?.active ?? 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-0.5">Writers</p>
              <p className="text-sm font-bold text-violet-500 dark:text-violet-400">{data.users?.writers ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.03] dark:border-violet-500/15 p-5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mb-1">
                Total Posts
              </p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {data.posts?.total ?? 0}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-4 pt-3 border-t border-slate-200 dark:border-white/[0.05]">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-0.5">Published</p>
              <p className="text-sm font-bold text-blue-500 dark:text-blue-400">{data.posts?.published ?? 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-0.5">Featured</p>
              <p className="text-sm font-bold text-amber-500">{data.posts?.featured ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.03] dark:border-emerald-500/15 p-5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mb-1">
                Subscriptions
              </p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{totalSubs}</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-white/[0.05]">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-0.5">Free</p>
              <p className="text-sm font-bold text-slate-750 dark:text-slate-300">{data.subscriptionTypes?.free ?? 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-0.5">Pro</p>
              <p className="text-sm font-bold text-blue-500 dark:text-blue-400">{data.subscriptionTypes?.pro ?? 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-0.5">Premium</p>
              <p className="text-sm font-bold text-amber-500">{data.subscriptionTypes?.premium ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.03] dark:border-amber-500/15 p-5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mb-1">
                Writer Applications
              </p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {data.users?.applyForWriter ?? 0}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/12 border border-amber-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-slate-200 dark:bg-white/[0.08] rounded-full">
              <div className="h-2 bg-yellow-500 rounded-full"
                style={{
                  width: `${
                    data.users?.total ? ((data.users.applyForWriter ?? 0) / data.users.total) * 100 : 0
                  }%`,
                }}>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-1">
              {data.users?.total ? (((data.users.applyForWriter ?? 0) / data.users.total) * 100).toFixed(1) : 0}% of total users
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06] p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
              <i className="fas fa-chart-bar text-blue-500 dark:text-blue-400 text-xs" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Posts per Month</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-600">Publication frequency trend</p>
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(data.posts?.perMonth ?? {}).map(([month, count]) => {
              const pct = maxPostCount ? ((count as number) / maxPostCount) * 100 : 0;
              return (
                <div key={month} className="flex items-center gap-3">
                  <p className="w-20 text-xs text-slate-500 font-mono shrink-0">{month}</p>
                  <div className="flex-1 bg-slate-200 dark:bg-white/[0.05] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="w-8 text-right text-xs font-bold text-slate-700 dark:text-slate-300">
                    {count as number}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06] p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
              <i className="fas fa-tags text-violet-500 dark:text-violet-400 text-xs" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Topics Distribution</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-600">Content by category</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.posts?.topics ?? {}).map(([topic, count], i) => {
              const pct = data.posts?.total ? (((count as number) / data.posts.total) * 100).toFixed(0) : "0";
              const colorClass = topicColors[i % topicColors.length];
              return (
                <div
                  key={topic}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border ${colorClass}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-current/10 shrink-0">
                    <span className="text-xs font-black">{pct}%</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-800 dark:text-white text-xs font-semibold truncate">{topic}</p>
                    <p className="text-[10px] text-slate-500">{count as number} posts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06] p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-slate-500/10 border border-slate-200 dark:border-white/[0.08] flex items-center justify-center">
            <i className="fas fa-user-shield text-slate-500 dark:text-slate-400 text-xs" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">User Status Overview</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-600">Account status breakdown</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/50 dark:bg-emerald-500/[0.06] dark:border-emerald-500/15 dark:hover:bg-emerald-500/[0.09] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Active Users</p>
              <p className="text-2xl font-black text-emerald-500 dark:text-emerald-400">{data.users?.active ?? 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200/50 dark:bg-white/[0.03] dark:border-white/[0.07] dark:hover:bg-white/[0.05] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/[0.06] dark:border-white/[0.10] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Inactive Users</p>
              <p className="text-2xl font-black text-slate-700 dark:text-slate-400">{data.users?.inactive ?? 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100/50 dark:bg-red-500/[0.05] dark:border-red-500/15 dark:hover:bg-red-500/[0.08] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-500/12 border border-red-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Blocked Users</p>
              <p className="text-2xl font-black text-red-550 dark:text-red-400">{data.users?.blocked ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalysisHeader;
