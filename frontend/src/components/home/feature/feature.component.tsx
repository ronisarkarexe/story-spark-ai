import { Post } from "../../../models/post";
import { useGetFeaturedListsQuery } from "../../../redux/apis/post.api";
import { formatDateShort } from "../../../utils/time-formate";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton";

import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const FeatureComponent = () => {
  const { data, isLoading, isError } = useGetFeaturedListsQuery(undefined);
  const navigate = useNavigate();

  // Dynamic reading calculation logic
  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;

    const words = content.trim().split(/\s+/).length;

    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <div className="mb-12 text-slate-900 dark:text-slate-100">
        <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
        <div className="rounded-lg border border-red-200 dark:border-red-900/70 bg-red-50 dark:bg-red-900/20 px-4 py-5 text-red-700 dark:text-red-400">
          Failed to load featured posts. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 text-slate-900 dark:text-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Featured Posts
      </h2>

      <div className="grid gap-8 sm:grid-cols-2">
        {(data?.posts?.length ?? 0) > 0 ? (
          data?.posts?.map((post: Post) => {
            const postUrl = `${window.location.origin}/post/${post._id}`;

            return (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="motion-card h-full bg-blue-500/10 rounded-lg shadow-sm overflow-hidden border border-slate-700/40 cursor-pointer hover:bg-blue-500/20 hover:border-blue-400/30 flex flex-col group"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    className="motion-image h-full w-full object-cover"
                    src={post.imageURL}
                    alt={post.title || "Featured Post"}
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <SSProfile
                          name={post.author?.name || "Unknown User"}
                          size="h-8 w-8"
                        />

                        <div className="ml-4">
                          <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                            {post.author?.name || "Unknown User"}
                          </p>

                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-slate-500 dark:text-gray-500">
                              {formatDateShort(post.createdAt)}
                            </p>

                            <span className="text-slate-400 dark:text-gray-600 text-xs">
                              •
                            </span>

                            <p className="text-xs text-purple-400 font-medium">
                              ⏱️ {calculateReadingTime(post.content)} min read
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10"
                      >
                        <BookmarkButton
                          storyId={post._id}
                          bookmarks={post.bookmarks}
                          className="p-1.5 rounded-full hover:bg-slate-700/40 text-slate-400 hover:text-purple-400 transition-colors"
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-300 mb-2 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.content || ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4 text-sm text-slate-500 dark:text-gray-500 mt-auto">
                    <div className="flex items-center">
                      <span className="flex items-center mr-4">
                        <i className="far fa-heart mr-1"></i>
                        {post.likesCount ?? 0}
                      </span>

                      <span className="flex items-center">
                        <i className="far fa-comment mr-1"></i>
                        {post.commentsCount ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 dark:text-gray-400">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          postUrl
                        )}&text=${encodeURIComponent(post.title || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on X"
                        className="motion-icon hover:text-sky-400 hover:-translate-y-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaXTwitter size={16} />
                      </a>

                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          postUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on LinkedIn"
                        className="motion-icon hover:text-blue-500 hover:-translate-y-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaLinkedin size={16} />
                      </a>

                      <a
                        href={`mailto:?subject=${encodeURIComponent(
                          post.title || ""
                        )}&body=${encodeURIComponent(
                          `${(post.content || "").slice(
                            0,
                            120
                          )}...\n\nRead more: ${postUrl}`
                        )}`}
                        title="Share via Email"
                        className="motion-icon hover:text-red-400 hover:-translate-y-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaEnvelope size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-900/40 px-4 py-5 text-slate-700 dark:text-slate-300">
            Feature Post is not available!
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureComponent;