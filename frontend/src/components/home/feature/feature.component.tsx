import { useNavigate } from "react-router-dom";

import { Post } from "../../../models/post";
import { useGetFeaturedListsQuery } from "../../../redux/apis/post.api";
import { formatDateShort } from "../../../utils/time-formate";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import BookmarkButton from "../../BookmarkButton";
import ImageFallback from "../../ImageFallback";

const FeatureComponent = () => {
  const { data, isLoading, isError, refetch } =
    useGetFeaturedListsQuery(undefined);
  const navigate = useNavigate();

  if (isLoading) return <LoadingAnimation />;

  if (isError) {
    return (
      <section className="mb-12 text-slate-900 dark:text-slate-100">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Featured Posts
        </h2>
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-center text-red-700 dark:text-red-200">
          <p className="mb-3 font-semibold">Failed to load featured posts.</p>
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

  const posts = (data?.posts ?? []).filter(Boolean).slice(0, 6);

  return (
    <section className="mb-12 text-slate-900 dark:text-slate-100">
      <h2
        className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Featured Posts
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
        {posts.length > 0 ? (
          posts.map((post: Post) => (
            <article
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="motion-card group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-500/30 dark:border-white/5 dark:bg-slate-900/40 dark:shadow-none"
            >
              <div className="relative h-48 overflow-hidden sm:h-52">
                <ImageFallback
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={post.imageURL}
                  alt={post.title || "Featured Post"}
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center">
                      <SSProfile
                        name={post.author?.name || "Unknown User"}
                        size="h-9 w-9"
                      />
                      <div className="ml-3 min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {post.author?.name || "Unknown User"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {formatDateShort(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-10"
                    >
                      <BookmarkButton
                        storyId={post._id}
                        bookmarks={post.bookmarks}
                        className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                      />
                    </div>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                    {post.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-300">
                    {post.content || ""}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-white/5 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <i className="far fa-heart"></i> {post.likesCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="far fa-comment"></i>{" "}
                      {post.commentsCount ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 text-slate-500 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-400">
            Featured posts are not available.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureComponent;

