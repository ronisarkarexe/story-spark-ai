import { Link } from "react-router-dom";
import { useGetPersonalizedRecommendationsQuery } from "../../../redux/apis/recommendation.api";
import { Post } from "../../../models/post";

const PersonalizedRecommendationsComponent = () => {
  const { data: posts, isLoading } = useGetPersonalizedRecommendationsQuery(undefined);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#111827]/40 rounded-2xl sm:rounded-3xl shadow-sm p-5 border border-slate-200 dark:border-white/10 mt-6 animate-pulse w-full box-border">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 mb-5"></div>
        <div className="space-y-4 w-full box-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 w-full box-border">
              <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0"></div>
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#111827]/40 rounded-2xl sm:rounded-3xl shadow-sm p-5 border border-slate-200 dark:border-white/10 mt-6 transition-all hover:shadow-xl w-full box-border">
      <div className="flex items-center gap-2 mb-4 select-none">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          For You ✨
        </h2>
      </div>

      <div className="space-y-3.5 w-full box-border">
        {posts.slice(0, 5).map((post: Post) => (
          <Link
            to={`/post/${post._id}`}
            key={post._id}
            className="group flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-950/40 p-2 -mx-2 rounded-xl transition-colors w-full box-border min-w-0"
          >
            <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl border border-slate-200/60 dark:border-white/5 select-none bg-slate-100 dark:bg-slate-900">
              <img
                src={post.imageURL}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 select-none">
                <span className="truncate max-w-[120px]">{post.author?.name || "Anonymous"}</span>
                {post.emotions && post.emotions.length > 0 && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="truncate text-emerald-600 dark:text-emerald-400 font-bold tracking-tight">
                      😊 {post.emotions[0]}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendationsComponent;