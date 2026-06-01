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
