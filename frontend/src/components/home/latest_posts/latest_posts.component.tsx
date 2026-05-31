import { useState } from "react";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import { useNavigate } from "react-router-dom";

const LatestPostsComponent = () => {
  const { data, isLoading, isError, refetch } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  // Track the ID of the currently expanded post (null means all are collapsed)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  if (isLoading) return <LoadingAnimation />;

  if (isError) {
    return (
      <section className="mb-12 text-slate-100">
        <h2 className="mb-6 text-2xl font-bold">Latest Posts</h2>
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-center text-red-200">
          <p className="mb-3 font-semibold">Failed to load latest posts.</p>
          <button
            onClick={() => refetch()}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // --- STRICT DEDUPLICATION FILTERING ---
  const seenIds = new Set<string>();
  const uniquePosts = (data?.posts ?? []).filter((post: Post) => {
    if (!post?._id || seenIds.has(post._id)) return false;
    seenIds.add(post._id);
    return true;
  });

  const toggleAccordion = (postId: string) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-200 mb-6"> Latest Posts</h2>
      <div className="space-y-6">
        {data?.posts?.length ?? 0 > 0 ? (
          data?.posts?.map((post: Post) => (
            <div
              key={post._id}
              className="bg-blue-500/10 rounded-lg shadow-sm p-6 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400 hover:ring-2 hover:ring-blue-300 hover:z-10">
              <div className="flex items-center mb-4">
                <SSProfile name={post.author?.name || 'Unknown User'} size="h-8 w-8" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                    {post.author?.name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateShort(post.createdAt)}
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {post.title}
              </h3>
              <p className="text-slate-700 dark:text-gray-300 mb-4">
                {post.content.slice(0, 170)}...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-600 dark:text-gray-400">
                  <span className="flex items-center mr-4">
                    <i className="far fa-heart mr-1"></i> {post.likesCount}
                  </span>
                  <span className="flex items-center mr-4">
                    <i className="far fa-comment mr-1"></i> {post.commentsCount}
                  </span>
                  <span className="flex items-center mr-4 bg-blue-100 text-blue-800 dark:bg-blue-500/30 dark:text-white text-xs font-medium px-2 py-1 rounded-full border border-blue-300 dark:border-blue-400/50">
                    <i className="far fa-clock mr-1"></i> {getReadingTime(post.content)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.topic.map((topic) => (
                    <span
                      key={topic._id}
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${topic.color}`}
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800 h-64 w-full"></div>
    <section className="text-slate-100">
      <h2 className="mb-6 text-2xl font-bold">Latest Posts</h2>
      <div className="space-y-3">
        {uniquePosts.length > 0 ? (
          uniquePosts.map((post: Post) => {
            const isExpanded = expandedPostId === post._id;

            return (
              <div
                key={post._id}
                className="motion-card-subtle story-panel rounded-lg overflow-hidden border border-slate-700/30 bg-[#252b3d]/40 transition-all duration-200"
              >
                {/* Accordion Header / Trigger Button */}
                <button
                  onClick={() => toggleAccordion(post._id)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-100 hover:bg-slate-700/20 transition-colors"
                >
                  <span className="text-lg md:text-xl pr-4">{post.title}</span>
                  <span className="text-slate-400 font-mono text-sm transition-transform duration-200 select-none">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </button>

                {/* Accordion Content Panel */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[500px] border-t border-slate-700/30" : "max-h-0"
                  }`}
                >
                  <div className="p-5 bg-[#1e2330]/30">
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content || "No preview content available."}
                    </p>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 shadow-sm"
                      >
                        Read Full Story
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 px-4 py-5 text-slate-500 dark:text-slate-400">
            Posts are not available.
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestPostsComponent;
