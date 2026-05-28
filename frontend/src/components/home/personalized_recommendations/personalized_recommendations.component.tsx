import { Link } from "react-router-dom";
import { useGetPersonalizedRecommendationsQuery } from "../../../redux/apis/recommendation.api";
import { Post } from "../../../models/post";

const PersonalizedRecommendationsComponent = () => {
  const { data: posts, isLoading } = useGetPersonalizedRecommendationsQuery(undefined);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 mt-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 mt-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">For You ✨</h2>
      </div>

      <div className="space-y-4">
        {posts.slice(0, 5).map((post: Post) => (
          <Link
            to={`/post/${post._id}`}
            key={post._id}
            className="group flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 -mx-2 rounded-lg transition-colors"
          >
            <div className="w-16 h-16 shrink-0 overflow-hidden rounded-lg">
              <img
                src={post.imageURL}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="truncate">{post.author?.name || "Anonymous"}</span>
                {post.emotions && post.emotions.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="truncate text-emerald-500">😊 {post.emotions[0]}</span>
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
