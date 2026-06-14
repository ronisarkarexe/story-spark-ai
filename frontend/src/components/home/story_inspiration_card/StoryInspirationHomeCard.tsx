import { Link } from "react-router-dom";
import { inspirationData } from "../../story-inspiration/inspirationData";

const FEATURED_GENRE_COLORS: Record<string, string> = {
  Fantasy:   "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  Horror:    "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  "Sci-Fi":  "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  Mystery:   "bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300",
  Adventure: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  Romance:   "bg-pink-100 text-pink-800 dark:bg-pink-500/15 dark:text-pink-300",
};

const GENRE_ICONS: Record<string, string> = {
  Fantasy:   "fa-wand-magic-sparkles",
  Horror:    "fa-ghost",
  "Sci-Fi":  "fa-rocket",
  Mystery:   "fa-user-secret",
  Adventure: "fa-compass",
  Romance:   "fa-heart",
};

const FEATURED_IDS = [
  "alice-wonderland",
  "and-then-there-were-none",
  "war-of-worlds",
];

const StoryInspirationHomeCard = () => {
  const featured = FEATURED_IDS
    .map((id) => inspirationData.find((s) => s.id === id))
    .filter(Boolean) as typeof inspirationData;

  const totalStories = inspirationData.length;
  const genres = [...new Set(inspirationData.map((s) => s.genre))];

  return (
    <section className="rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <i className="fas fa-book-open text-white text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Story Inspiration</h3>
              <p className="text-xs text-indigo-200">{totalStories} classic works</p>
            </div>
          </div>
          <Link
            to="/story-inspiration"
            className="text-xs font-semibold text-indigo-100 hover:text-white transition-colors flex items-center gap-1"
          >
            Browse all
            <i className="fas fa-arrow-right text-[10px]" />
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {featured.map((story) => {
          const genreColor = FEATURED_GENRE_COLORS[story.genre] ?? "bg-slate-100 text-slate-700";
          const genreIcon = GENRE_ICONS[story.genre] ?? "fa-book";
          return (
            <Link
              key={story.id}
              to="/story-inspiration"
              className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {story.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{story.author}</p>
                <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${genreColor}`}>
                  <i className={`fas ${genreIcon} text-[9px]`} />
                  {story.genre}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {genres.map((genre) => {
            const color = FEATURED_GENRE_COLORS[genre] ?? "bg-slate-100 text-slate-600";
            const icon = GENRE_ICONS[genre] ?? "fa-book";
            return (
              <Link
                key={genre}
                to="/story-inspiration"
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 hover:scale-105 ${color}`}
              >
                <i className={`fas ${icon} text-[9px]`} />
                {genre}
              </Link>
            );
          })}
        </div>

        <Link
          to="/story-inspiration"
          className="
            flex items-center justify-center gap-2
            w-full py-2.5 rounded-lg
            bg-gradient-to-r from-indigo-600 to-violet-600
            text-white text-sm font-bold
            hover:shadow-lg hover:shadow-indigo-500/25
            hover:scale-[1.02]
            transition-all duration-200
          "
        >
          <i className="fas fa-compass text-sm" />
          Explore All Stories
        </Link>
      </div>
    </section>
  );
};

export default StoryInspirationHomeCard;
