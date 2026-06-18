import { Post } from "../../../models/post";
import { useGetFeaturedListsQuery } from "../../../redux/apis/post.api";
import { formatDateShort } from "../../../utils/time-formate";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton";
import React, { useState } from "react";
import { FaLinkedin, FaEnvelope, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ImageFallback from "../../ImageFallback";
import { SkeletonGrid } from "../../cards/SkeletonCard";

const FeatureComponent = () => {
  const { data, isLoading, isError } = useGetFeaturedListsQuery(undefined);
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleCopyLink = (e: React.MouseEvent, postId: string, postUrl: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopiedId(postId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (isLoading) {
    return (
      <section className="w-full box-border mb-12">
        <h2 className="mb-6 text-xl sm:text-2xl font-extrabold tracking-tight select-none text-slate-900 dark:text-slate-100">
          Featured Posts
        </h2>
        <SkeletonGrid count={4} variant="home-featured" />
      </section>
    );
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

  const posts = data?.posts || [];

  return (
    <section className="w-full box-border mb-12 text-slate-900 dark:text-slate-100">
      <h2 className="mb-6 text-xl sm:text-2xl font-extrabold tracking-tight select-none">
        Featured Posts
      </h2>

      {posts.length > 0 ? (
        <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0 xl:grid-cols-3">
          {posts.map((post: Post) => {
            const postUrl = `${window.location.origin}/post/${post._id}`;

            return (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="motion-card h-full min-w-[85vw] snap-start bg-blue-500/10 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden border border-slate-700/40 cursor-pointer hover:bg-blue-500/20 hover:border-blue-400/30 flex flex-col group box-border w-full md:min-w-0"
              >
                {post.imageURL && (
                  <div className="relative overflow-hidden h-48 w-full">
                    <ImageFallback
                      className="motion-image h-full w-full object-cover"
                      src={post.imageURL}
                      alt={post.title || "Featured Post"}
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between box-border w-full">
                  <div>
                    <div className="flex items-center justify-between mb-4 w-full">
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
                              &bull;
                            </span>

                            <p className="text-xs text-purple-400 font-medium flex items-center gap-1">
                              <i className="fa-regular fa-clock"></i> {calculateReadingTime(post.content)} min read
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
                          className="p-1.5 rounded-full hover:bg-slate-700/40 text-slate-400 hover:text-purple-400 transition-colors"
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 text-xs sm:text-sm font-medium leading-relaxed">
                      {post.content || ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4 text-sm text-slate-500 dark:text-gray-500 mt-auto w-full">
                    <div className="flex items-center select-none">
                      <span className="flex items-center mr-4">
                        <i className="far fa-heart mr-1" aria-hidden="true"></i>
                        {post.likesCount ?? 0}
                      </span>
                      <span className="flex items-center">
                        <i className="far fa-comment mr-1" aria-hidden="true"></i>
                        {post.commentsCount ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 dark:text-gray-400">
                      <a
                        href={`https://x.com/intent/tweet?url=${encodeURIComponent(
                          postUrl
                        )}&text=${encodeURIComponent(post.title || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on X"
                        className="motion-icon hover:text-sky-400 hover:-translate-y-0.5 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaXTwitter size={16} />
                      </a>

                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on LinkedIn"
                        className="motion-icon hover:text-blue-500 hover:-translate-y-0.5 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaLinkedin size={16} />
                      </a>

                      <a
                        href={`mailto:?subject=${encodeURIComponent(post.title || "")}&body=${encodeURIComponent(`${(post.content || "").slice(0, 120)}...\n\nRead more: ${postUrl}`)}`}
                        title="Share via Email"
                        className="motion-icon hover:text-red-400 hover:-translate-y-0.5 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaEnvelope size={16} />
                      </a>

                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(e, post._id, postUrl)}
                        title={copiedId === post._id ? "Link copied!" : "Copy link"}
                        aria-label="Copy post link"
                        className={`transition-colors duration-200 focus:outline-none ${
                          copiedId === post._id ? "text-green-400" : "hover:text-blue-400"
                        }`}
                      >
                        <FaLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-12 text-center box-border max-w-full">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-5 border border-slate-200/60 dark:border-white/5">
            <i className="fa-solid fa-star text-slate-400 dark:text-slate-500 text-xl" aria-hidden="true"></i>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            No featured nodes are highlighted inside the stream right now.
          </p>
        </div>
      )}
    </section>
  );
};

export default FeatureComponent;
