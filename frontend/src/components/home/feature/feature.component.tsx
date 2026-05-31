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

const FeatureComponent = () => {
  const { data, isLoading, isError, refetch } = useGetFeaturedListsQuery(undefined);
  const navigate = useNavigate();
  if (isLoading) return <LoadingAnimation />;
  if (isError) {
    return (
      <div className="mb-12 rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-center text-red-200">
        <p className="mb-3 font-semibold">Failed to load featured posts.</p>
        <button
          onClick={() => refetch()}
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mb-12 text-slate-900 dark:text-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Featured Posts
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
        {(data?.posts?.length ?? 0) > 0 ? (
          data?.posts?.map((post: Post) => {
            const postUrl = `${window.location.origin}/post/${post._id}`;

            return (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="motion-card story-panel group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/30 shadow-md shadow-slate-100 dark:shadow-none"
              >
                <div className="relative h-48 overflow-hidden sm:h-52">
                  <img
                    className="motion-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatDateShort(post.createdAt)}
                            </p>
                            <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
                            <p className="text-xs font-medium text-indigo-500 dark:text-indigo-300">
                              ⏱️ {calculateReadingTime(post.content)} min read
                            </p>
                          </div>
                        </div>
                      </div>

                      <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                        <BookmarkButton
                          storyId={post._id}
                          bookmarks={post.bookmarks}
                          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                      {post.content || ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4 text-sm text-slate-500 dark:text-slate-400 mt-auto">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <i className="far fa-heart"></i> {post.likesCount ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="far fa-comment"></i> {post.commentsCount ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          postUrl
                        )}&text=${encodeURIComponent(post.title || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaXTwitter size={15} />
                      </a>

                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          postUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaLinkedin size={15} />
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
                        className="hover:text-red-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaEnvelope size={15} />
                      </a>

                      <button
                        onClick={(e) => handleCopyLink(e, post._id, postUrl)}
                        className={`transition-colors duration-200 ${
                          copiedId === post._id
                            ? "text-green-500"
                            : "hover:text-indigo-500"
                        }`}
                      >
                        <FaLink size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 px-4 py-5 text-slate-500 dark:text-slate-400">
            Featured posts are not available.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureComponent;
