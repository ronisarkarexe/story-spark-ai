import React from "react";

const trendingTopics = [
  "Fantasy Adventures",
  "Mystery Crimes",
  "Sci-Fi Worlds",
  "Romantic Stories",
  "Historical Fiction",
  "Horror Tales",
  "Adventure Quests",
  "Mythological Legends",
];

const TrendingTopicComponent = () => {
  return (
    <section
      className="bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg shadow-sm p-6 mb-8"
      aria-label="Trending Topics"
    >
      <h3 className="text-lg font-semibold mb-4">Trending Topics</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trendingTopics.map((topic) => (
          <a
            key={topic}
            href="#"
            className="flex items-center justify-center rounded-md border border-slate-200/60 dark:border-white/10 bg-slate-50/40 dark:bg-white/5 px-3 py-2 text-sm font-semibold hover:scale-105 hover:shadow-md transition-all"
          >
            {topic}
          </a>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopicComponent;

