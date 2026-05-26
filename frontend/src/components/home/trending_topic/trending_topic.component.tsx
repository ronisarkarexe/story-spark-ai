import React from "react";
import { topicsData } from "../../stories/stories.utils";

const TrendingTopicComponent = () => {
  return (
    <section className="parchment-card p-6 mb-8">
      <h3 className="text-lg font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6] mb-4 border-b border-[#d4b896]/20 pb-2">
        Trending Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {topicsData.map((topic, index) => (
          <a
            key={index}
            href="#"
            className="px-3 py-1 bg-[#fdf8f0] dark:bg-[#3d2314] text-[#8b1a1a] dark:text-[#c9a227] border border-[#d4b896] dark:border-[#5c3d2e] rounded-full text-xs font-[Cormorant_Garamond] font-bold shadow-sm hover:bg-[#e8d5b0] dark:hover:bg-[#5c3d2e] transition-all hover:scale-105"
          >
            {topic.title}
          </a>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopicComponent;