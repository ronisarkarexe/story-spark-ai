import React from "react";
import { Link } from "react-router-dom";
import { topicsData } from "../../stories/stories.utils";

const TrendingTopicComponent = () => {
  return (
    <section className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full box-border shadow-sm">
      <h3 className="mb-4 text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 select-none">
        Trending Topics
      </h3>
      <div className="flex flex-wrap gap-2 w-full box-border">
        {topicsData.map((topic) => (
          <Link
            key={topic.title}
            to={`/stories?topic=${encodeURIComponent(topic.title.toLowerCase())}`}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/20 dark:hover:border-blue-500/30 transition-all duration-150 cursor-pointer select-none uppercase tracking-wider shadow-sm no-underline inline-block"
          >
            {topic.title}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopicComponent;