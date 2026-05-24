import React from "react";
import { topicsData } from "../../stories/stories.utils";

const TrendingTopicComponent = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1630]/55 p-6 shadow-xl backdrop-blur-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.20) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <h3 className="relative text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
        Trending Topics
      </h3>
      <div className="relative mt-4 flex flex-wrap gap-2">
        {topicsData.map((topic, index) => (
          <button
            key={index}
            type="button"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[13px] font-medium text-slate-200 transition-all duration-200 hover:border-blue-500/30 hover:bg-white/10 hover:text-blue-200"
          >
            {topic.title}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopicComponent;
