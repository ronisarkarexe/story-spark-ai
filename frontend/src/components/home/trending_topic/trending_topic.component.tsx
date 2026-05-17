import { Link } from "react-router-dom";
import { topicsData } from "../../stories/stories.utils";

const tagToExplore = (title: string) =>
  title.startsWith("#") ? title.slice(1).toLowerCase() : title.toLowerCase();

const TrendingTopicComponent = () => {
  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base font-bold tracking-wide text-white sm:text-lg">
          Trending topics
        </h3>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-200">
          <i className="fas fa-fire text-amber-400" aria-hidden="true" />
          Hot
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {topicsData.map((topic) => (
          <Link
            key={topic.title}
            to={`/explore?tag=${encodeURIComponent(tagToExplore(topic.title))}`}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${topic.color}`}
          >
            <i className="fas fa-hashtag text-[0.65rem] opacity-80" aria-hidden="true" />
            {topic.title.replace("#", "")}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        Tap a topic to discover stories in that theme on Explore.
      </p>
    </section>
  );
};

export default TrendingTopicComponent;
