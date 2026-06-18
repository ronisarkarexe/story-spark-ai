import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import CommunitySpotlightSkeleton from "../community_spotlight/CommunitySpotlightSkeleton";
type SpotlightWriter = {
  author: Post["author"];
  storiesCount: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  bookmarksCount: number;
  engagementScore: number;
  topPost: Post;
};

const TOP_WRITERS_LIMIT = 3;

const getBookmarkCount = (post: Post) => post.bookmarksCount ?? 0;

const getPostEngagementScore = (post: Post) =>
  (post.likesCount ?? 0) * 3 +
  (post.commentsCount ?? 0) * 2 +
  getBookmarkCount(post) * 2 +
  (post.viewsCount ?? 0);

const getWriterEngagementScore = (writer: Omit<SpotlightWriter, "engagementScore">) =>
  writer.likesCount * 3 +
  writer.commentsCount * 2 +
  writer.bookmarksCount * 2 +
  writer.viewsCount +
  writer.storiesCount * 5;

const rankStyles = [
  {
    badge: "bg-amber-400 text-slate-950 shadow-amber-500/30",
    ring: "ring-amber-300/70 dark:ring-amber-400/40",
    label: "Community leader",
  },
  {
    badge: "bg-sky-400 text-slate-950 shadow-sky-500/30",
    ring: "ring-sky-300/70 dark:ring-sky-400/40",
    label: "Rising favorite",
  },
  {
    badge: "bg-violet-400 text-slate-950 shadow-violet-500/30",
    ring: "ring-violet-300/70 dark:ring-violet-400/40",
    label: "Reader pick",
  },
];

const formatMetric = (value: number) =>
  new Intl.NumberFormat("en", { notation: "compact" }).format(value);

const CommunitySpotlightComponent = () => {
  const { data, isLoading, isError } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  const topWriters = useMemo<SpotlightWriter[]>(() => {
    const writers = new Map<string, Omit<SpotlightWriter, "engagementScore">>();

    data?.posts?.forEach((post: Post) => {
      if (!post.author) return;

      const authorKey = post.author._id || post.author.email || post.author.name;
      if (!authorKey) return;

      const existingWriter = writers.get(authorKey);
      const postScore = getPostEngagementScore(post);

      if (!existingWriter) {
        writers.set(authorKey, {
          author: post.author,
          storiesCount: 1,
          likesCount: post.likesCount ?? 0,
          commentsCount: post.commentsCount ?? 0,
          viewsCount: post.viewsCount ?? 0,
          bookmarksCount: getBookmarkCount(post),
          topPost: post,
        });
        return;
      }

      existingWriter.storiesCount += 1;
      existingWriter.likesCount += post.likesCount ?? 0;
      existingWriter.commentsCount += post.commentsCount ?? 0;
      existingWriter.viewsCount += post.viewsCount ?? 0;
      existingWriter.bookmarksCount += getBookmarkCount(post);

      if (postScore > getPostEngagementScore(existingWriter.topPost)) {
        existingWriter.topPost = post;
      }
    });

    return Array.from(writers.values())
      .map((writer) => ({
        ...writer,
        engagementScore: getWriterEngagementScore(writer),
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, TOP_WRITERS_LIMIT) as SpotlightWriter[];
  }, [data?.posts]);

  if (isLoading) {
  return (
    <section className="px-5 py-10 text-slate-100">
      <h2 className="mb-6 text-3xl font-bold">
        Community Spotlight
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <CommunitySpotlightSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 box-border">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.02] p-5 text-center text-sm font-semibold text-red-500 dark:text-red-400">
          Failed to load spotlight stories from the ecosystem database.
        </div>
      </div>
    );
  }

  const spotlightPosts = data?.posts ?? [];

  return (
    <section className="w-full box-border py-6 sm:py-10 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border">
        {/* Section Header */}
        <div className="mb-10 w-full max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 mb-4 select-none shadow-sm dark:shadow-none">
            <i className="fa-solid fa-star text-xs" aria-hidden="true"></i>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Curated Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Community Spotlight
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Explore highly engaging interactive story modules written by collaborative system authors.
          </p>
        </div>

        {/* Top Featured Creators Grid */}
        <div className="mb-14 w-full">
          <h3 className="text-lg sm:text-xl font-bold mb-6 tracking-tight border-b border-slate-100 dark:border-white/5 pb-3">
            Top Storytellers
          </h3>
          {topWriters.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 box-border">
              {topWriters.map((writer, index) => {
                const rank = index + 1;
                const style = rankStyles[index];

                return (
                  <button
                    key={writer.author._id || writer.author.email || writer.author.name}
                    type="button"
                    aria-label={`Read ${writer.topPost.title} by ${writer.author.name || "Unknown User"}`}
                    onClick={() => navigate(`/post/${writer.topPost._id}`)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 text-left shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:border-blue-400/50 dark:focus:ring-offset-slate-950 box-border"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-amber-400"></div>

                    <div className="mb-6 flex items-start justify-between gap-4 w-full box-border">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className={`rounded-full ring-4 ${style.ring} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                          <SSProfile name={writer.author.name || "Unknown User"} size="h-14 w-14" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-lg font-bold text-slate-900 dark:text-gray-100">
                            {writer.author.name || "Unknown User"}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-gray-500">
                            {style.label}
                          </p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-black shadow-lg ${style.badge}`}>
                        #{rank}
                      </span>
                    </div>

                    <div className="mb-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700/60 dark:bg-slate-800/50 w-full box-border">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-gray-500">
                        Top story
                      </p>
                      <h4 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                        {writer.topPost.title}
                      </h4>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 text-sm w-full box-border">
                      <div className="rounded-xl bg-blue-50 px-3 py-3 dark:bg-blue-500/10">
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatMetric(writer.engagementScore)}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Score</p>
                      </div>
                      <div className="rounded-xl bg-violet-50 px-3 py-3 dark:bg-violet-500/10">
                        <p className="text-lg font-bold text-violet-700 dark:text-violet-300">{formatMetric(writer.storiesCount)}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Stories</p>
                      </div>
                      <div className="rounded-xl bg-slate-100 px-3 py-3 dark:bg-slate-800">
                        <p className="text-lg font-bold text-slate-800 dark:text-gray-200">{formatMetric(writer.likesCount)}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Likes</p>
                      </div>
                      <div className="rounded-xl bg-slate-100 px-3 py-3 dark:bg-slate-800">
                        <p className="text-lg font-bold text-slate-800 dark:text-gray-200">{formatMetric(writer.viewsCount)}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Views</p>
                      </div>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-300 dark:group-hover:text-blue-200">
                      Read top story
                      <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"></i>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-5 text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/40 dark:text-slate-300">
              No top contributors available.
            </div>
          )}
        </div>

        {/* Recent Spotlight Content Grid */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-6 tracking-tight border-b border-slate-100 dark:border-white/5 pb-3">
            Trending Works
          </h3>
          {spotlightPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 w-full box-border">
              {spotlightPosts.slice(0, 6).map((post: Post) => {
                const authorName = post.author?.name || "Unknown User";
                return (
                  <button
                    key={post._id}
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="w-full text-left bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-200 hover:scale-[1.01] hover:border-blue-500/20 dark:hover:border-blue-500/30 cursor-pointer outline-none select-none flex flex-col justify-between box-border group"
                  >
                    <div className="w-full box-border">
                      <div className="mb-4 flex items-center gap-3 w-full box-border">
                        <div className="shrink-0 border border-slate-200/80 dark:border-white/10 rounded-full overflow-hidden">
                          <SSProfile name={authorName} size="h-8 w-8 text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 truncate tracking-tight">
                            {authorName}
                          </p>
                        </div>
                      </div>
                      <h4 className="mb-2 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="line-clamp-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1 text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider select-none">
                      Read Story
                      <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5" aria-hidden="true"></i>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-10 sm:p-14 text-center box-border max-w-full">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-5 border border-slate-200/60 dark:border-white/5 select-none">
                <i className="fa-solid fa-layer-group text-slate-400 dark:text-slate-500 text-xl" aria-hidden="true"></i>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                No Spotlight Stories available
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-normal">
                Check back shortly as system engines process content records into the stream.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunitySpotlightComponent;
