import React from "react";
import { topicsData } from "../../stories/stories.utils";

const TrendingTopicComponent = () => {
  return (
    <section className="bg-blue-500/10 rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-300 mb-4">
        Trending Topics
      </h3>
      <div className="flex flex-wrap gap-2 w-full box-border">
        {topicsData.map((topic) => (
          <span 
            key={topic.title} 
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/20 dark:hover:border-blue-500/30 transition-all duration-150 cursor-pointer select-none uppercase tracking-wider shadow-sm"
          >
            {topic.title}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopicComponent;
