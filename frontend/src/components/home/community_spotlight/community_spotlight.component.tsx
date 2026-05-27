import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";

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

const getBookmarkCount = (post: Post) => post.bookmarks?.length ?? 0;

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

  const topWriters = useMemo(() => {
    const writers = new Map<string, Omit<SpotlightWriter, "engagementScore">>();

    data?.posts?.forEach((post: Post) => {
      if (!post.author) return;

      const authorKey = post.author._id || post.author.email || post.author.name;
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
      .slice(0, TOP_WRITERS_LIMIT);
  }, [data?.posts]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <section className="px-5 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-200">
            Community Spotlight
          </h2>
          <p className="mt-2 text-slate-600 dark:text-gray-400">
            Top contributors loved by the Story Spark community
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-red-700 dark:border-red-900/70 dark:bg-red-900/20 dark:text-red-400">
          Failed to load community spotlight writers. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-10 text-slate-900 dark:text-slate-100">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
            Top 3 contributors
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-100">
            Community Spotlight
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-gray-400 sm:text-base">
            Ranked by stories, views, likes, comments, and bookmarks from the
            latest community activity.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
          <i className="fas fa-wand-magic-sparkles text-xs"></i>
          Reader powered
        </div>
      </div>

      {topWriters.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topWriters.map((writer, index) => {
            const rank = index + 1;
            const style = rankStyles[index];

            return (
              <button
                key={writer.author._id || writer.author.email || writer.author.name}
                type="button"
                aria-label={`Read ${writer.topPost.title} by ${
                  writer.author.name || "Unknown User"
                }`}
                onClick={() => navigate(`/post/${writer.topPost._id}`)}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 text-left shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:border-blue-400/50 dark:focus:ring-offset-slate-950"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-amber-400"></div>

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`rounded-full ring-4 ${style.ring} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <SSProfile
                        name={writer.author.name || "Unknown User"}
                        size="h-14 w-14"
                      />
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

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-black shadow-lg ${style.badge}`}
                  >
                    #{rank}
                  </span>
                </div>

                <div className="mb-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700/60 dark:bg-slate-800/50">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-gray-500">
                    Top story
                  </p>
                  <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                    {writer.topPost.title}
                  </h3>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-blue-50 px-3 py-3 dark:bg-blue-500/10">
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {formatMetric(writer.engagementScore)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Score
                    </p>
                  </div>
                  <div className="rounded-xl bg-violet-50 px-3 py-3 dark:bg-violet-500/10">
                    <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
                      {formatMetric(writer.storiesCount)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Stories
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-100 px-3 py-3 dark:bg-slate-800">
                    <p className="text-lg font-bold text-slate-800 dark:text-gray-200">
                      {formatMetric(writer.likesCount)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Likes
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-100 px-3 py-3 dark:bg-slate-800">
                    <p className="text-lg font-bold text-slate-800 dark:text-gray-200">
                      {formatMetric(writer.viewsCount)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Views
                    </p>
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-300 dark:group-hover:text-blue-200">
                  Read top story
                  <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-100 px-5 py-5 text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/40 dark:text-slate-300">
          No top contributors yet.
        </div>
      )}
    </section>
  );
};

export default CommunitySpotlightComponent;
