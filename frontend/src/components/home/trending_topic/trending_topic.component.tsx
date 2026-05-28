import { topicsData } from "../../stories/stories.utils";

const TrendingTopicComponent = () => {
  return (
    <section className="story-panel rounded-lg p-5 sm:p-6">
      <h3 className="mb-4 text-lg font-bold tracking-tight text-slate-100">Trending Topics</h3>
      <div className="flex flex-wrap gap-2">
        {topicsData.map((topic) => (
          <span key={topic.title} className="story-chip px-3 py-1.5 text-sm font-semibold">
            {topic.title}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopicComponent;
