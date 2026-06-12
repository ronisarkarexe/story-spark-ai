import React from "react";
import { topicsData } from "../../stories/stories.utils";

const TrendingTopicComponent = () => {
  return (
    <section className="bg-blue-500/10 rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-300 mb-4">
        Trending Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {topicsData.map((topic, index) => (
          <a
            key={index}
            href="#"
            className="story-chip px-3 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-200"
          >
            {topic.title}
          </a>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopicComponent;
