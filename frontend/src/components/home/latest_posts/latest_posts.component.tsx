import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { formatDateShort } from "../../../utils/time-formate";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";

const LatestPostsComponent = () => {
  const { data, isLoading, isError, refetch } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  const uniquePosts = useMemo(() => {
    const seenIds = new Set<string>();
    return (data?.posts ?? []).filter((post: Post) => {
      if (!post?._id || seenIds.has(post._id)) return false;
      seenIds.add(post._id);
      return true;
    });
  }, [data?.posts]);

  if (isLoading) return <LoadingAnimation />;

  if (isError) {
    return (
      <section className="mb-12 text-slate-900 dark:text-slate-100">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Latest Posts
        </h2>
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-center text-red-700 dark:text-red-200">
          <p className="mb-3 font-semibold">Failed to load latest posts.</p>
          <button
            onClick={() => refetch()}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            type="button"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="text-slate-900 dark:text-slate-100">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
        Latest Posts
      </h2>

      <div className="space-y-5">
        {uniquePosts.length > 0 ? (
          uniquePosts.slice(0, 6).map((post: Post) => (
            <article
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="motion-card-subtle group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-500/30 dark:border-white/5 dark:bg-slate-900/40 dark:shadow-none"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <SSProfile
                    name={post.author?.name || "Unknown User"}
                    size="h-9 w-9"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {post.author?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDateShort(post.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                {post.title}
              </h3>
              <p className="line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-300">
                {post.content || ""}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 text-slate-500 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-400">
            Posts are not available.
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestPostsComponent;
