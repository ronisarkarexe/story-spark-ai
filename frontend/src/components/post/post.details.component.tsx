/* eslint-disable */
import { StoryMetaTags } from "./StoryMetaTags";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useDeletePostMutation,
  useGetPostByIdQuery,
  useGetPostByTagQuery,
  useUpdatePostMutation,
} from "../../redux/apis/post.api";
import RelatedStoriesComponent from "./related.stories.view.component";
import PostCommentComponent from "./post.comment.component";
import { ComparisonMode } from "../story-comparison";
import StarRatingDisplay from "../story-rating/StarRatingDisplay";
import StoryRatingInput from "../story-rating/StoryRatingInput";

import LoadingAnimation from "../loading/loading.component";
import SSProfile from "../ui-component/ss-profile/ss-profile";
import ImageFallback from "../ImageFallback";
import BookmarkButton from "../BookmarkButton";
import AudioPlayer from "../AudioPlayer";
import ReaderPreferencesPanel from "../reader-preferences/ReaderPreferences";
import { useReaderPreferences } from "../reader-preferences/useReaderPreferences";

import { formatDateShort } from "../../utils/time-formate";
import { calculateReadingTime } from "../../utils/reading-time";
import { formatReadingStats } from "../../utils/story-utils";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";

import { useToggleReactionMutation } from "../../redux/apis/reaction.api";
import SimilarStories from "../recommendations/SimilarStories";

import {
  useToggleFollowMutation,
  useGetFollowStatusQuery,
} from "../../redux/apis/user.api";

import {
  useGetVersionsByStoryIdQuery,
  useRestoreVersionMutation,
  useGetStoryTreeQuery,
  useCreateBranchVersionMutation,
} from "../../redux/apis/storyVersion.api";

import { toast } from "react-hot-toast";
import StoryTranslator from "../translate/StoryTranslator";
import { IStories } from "../stories/stories.view.component";



interface IStoryVersion {
  _id: string;
  storyId: string;
  content: string;
  title: string;
  prompt?: string;
  generationType: string;
  versionNumber: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const PostDetailsComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: post, isLoading } = useGetPostByIdQuery(id || "");

  const tag = post?.tag;

  const { data: relatedPost } = useGetPostByTagQuery(
    {
      tag: tag || "",
      excludeId: post?._id || "",
    },
    {
      skip: !tag,
    }
);
  
  const [toggleReaction] = useToggleReactionMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const currentUser = getUserInfo();

  const authorId = post?.author?._id;
  const isOwner = Boolean(
    currentUser?.userId && authorId === currentUser.userId
  );

  const { data: followData } = useGetFollowStatusQuery(authorId || "", {
    skip: !authorId || !currentUser,
  });

  const [toggleFollow] = useToggleFollowMutation();
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);

  const isFollowing = followData?.isFollowing ?? false;

  useEffect(() => {
  const updateProgress = () => {
    const article = articleRef.current;
    if (!article) return;
    const { top, height } = article.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrolled = Math.max(0, -top);
    const total = Math.max(1, height - windowHeight);
    setReadingProgress(Math.min(100, (scrolled / total) * 100));
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [showTimeline, setShowTimeline] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showTree, setShowTree] = useState(false);
  const [selectedVersionForBranch, setSelectedVersionForBranch] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const readerPreferences = useReaderPreferences();
  const { data: versions, isLoading: isLoadingVersions } = useGetVersionsByStoryIdQuery(id || "", {
    skip: !id || (!showTimeline && !showComparison),
  });
  const [restoreVersion, { isLoading: isRestoring }] = useRestoreVersionMutation();
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setReadProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: storyTree } = useGetStoryTreeQuery(id || "", { skip: !id || !showTree,});

  const [createBranchVersion] = useCreateBranchVersionMutation();

  const isAuthor = !!currentUser && authorId === currentUser?.userId;

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("You need to login to follow this author");
      return;
    }

    if (!authorId) return;

    try {
      await toggleFollow(authorId).unwrap();
    } catch {
      toast.error("Failed to update follow status");
    }
  };

  const handleLike = async () => {
    if (!id) return;

    try {
      await toggleReaction({ postId: id }).unwrap();
    } catch (error) {
      console.error("Failed to toggle reaction", error);
      toast.error("You need to login to perform this action");
    }
  };
  
  const handleSaveChanges = async () => {
    if (!id) return;
    if (!editedTitle.trim() || !editedContent.trim()) {
      toast.error("Title and content cannot be empty.");
      return;
    }
    try {
      await updatePost({
        id,
        data: {
          title: editedTitle,
          content: editedContent,
          generationType: "edited",
        },
      }).unwrap();
      toast.success("Story updated and version snapshot saved!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update story. Please try again.");
    }
  };

  const handleRestore = async (versionId: string) => {
    const confirmRestore = window.confirm(
      "Are you sure you want to restore this version? Your current version will be saved as a snapshot first."
    );
    if (!confirmRestore) return;

    try {
      await restoreVersion(versionId).unwrap();
      toast.success("Story successfully restored to selected version!");
      setShowTimeline(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore version.");
    }
  };

  const handleCreateBranch = async (versionId: string) => {const branchName = window.prompt("Enter a branch name");

  if (!branchName?.trim()) {
    return;
  }

  try {
    await createBranchVersion({versionId, branchName,}).unwrap();

    toast.success("Branch created successfully!");
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to create branch"
    );
  }
};

  const hasUserReacted = post?.reactions?.some((r) => {
    const userId = r.userId;

    const reactorId =
      typeof userId === "object" && userId !== null && "_id" in userId
        ? userId._id
        : userId;

    return Boolean(currentUser?.userId) && reactorId === currentUser?.userId;
  });

  const handleTwitterShare = () => {
    const currentUrl = window.location.href;
    const currentTitle = post?.title || "Check out this story!";
    const url = `https://x.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(currentTitle)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShowShareMenu(false);
  };

  const handleLinkedInShare = () => {
    const currentUrl = window.location.href;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShowShareMenu(false);
  };

  const handleEmailShare = () => {
    const currentUrl = window.location.href;
    const currentTitle = post?.title || "Check out this story!";
    const subject = `Story Spark AI - ${currentTitle}`;
    const body = `Check out this interesting story on Story Spark AI: "${currentTitle}"\n\nRead it here: ${currentUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
    setShowShareMenu(false);
  } catch {
    toast.error("Failed to copy link.");
  }
};

  const handleWhatsAppShare = () => {
  const currentUrl = window.location.href;
  const currentTitle = post?.title || "Check out this story!";

  const url = `https://wa.me/?text=${encodeURIComponent(
    `${currentTitle} ${currentUrl}`
  )}`;

  window.open(url, "_blank", "noopener,noreferrer");
  setShowShareMenu(false);
};

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm(
        "Remove this story from public view? It will remain available for reporting."
      )
    ) {
      return;
    }

    try {
      await deletePost(id).unwrap();
      toast.success("Story removed successfully.");
      navigate("/explore");
    } catch {
      toast.error("Unable to remove this story. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white relative">

      {/* OG Meta Tags for social sharing */}
      <StoryMetaTags
        title={post?.title}
        content={post?.content}
        imageURL={post?.imageURL}
        postId={id}
      />

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 z-50 h-1 bg-indigo-500 transition-all duration-100"
        style={{ width: `${readProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-6 flex justify-between">
          <div
            onClick={() => navigate(-1)}
            className="!rounded-button bg-gray-100/80 hover:bg-gray-200/80 text-slate-900 dark:bg-white/20 dark:hover:bg-white/30 dark:text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded border border-gray-200 dark:border-white/10 cursor-pointer"
          >
            <i className="fa-solid fa-left-long"></i> BACK
          </div>

          <div></div>
        </div>

        <div className="rounded-lg shadow-sm bg-gray-50 border border-gray-200 text-slate-900 mb-10 dark:bg-[#0f172a]/70 dark:border-transparent dark:text-white">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                {post?.author?._id ? (
                  <Link to={`/profile/${post.author._id}`} className="flex items-center shrink-0 hover:opacity-85 transition">
                    <SSProfile
                      name={post?.author?.name || "Unknown User"}
                      size="h-12 w-12"
                    />
                  </Link>
                ) : (
                  <SSProfile
                    name={post?.author?.name || "Unknown User"}
                    size="h-12 w-12"
                  />
                )}

                <div>
                  <h3 className="font-medium text-slate-700 dark:text-gray-400">
                    {post?.author?._id ? (
                      <Link to={`/profile/${post.author._id}`} className="hover:text-indigo-650 dark:hover:text-indigo-400 transition">
                        {post?.author?.name || "Unknown User"}
                      </Link>
                    ) : (
                      post?.author?.name || "Unknown User"
                    )}
                  </h3>

                  <div className="flex items-center text-sm text-slate-500 dark:text-gray-500">
                    <span>{formatDateShort(post ? post?.createdAt : "")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isOwner && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded border border-red-500/40 px-4 py-1 text-sm text-red-300 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60 mr-2"
                  >
                    {isDeleting ? "Removing..." : "Remove Story"}
                  </button>
                )}
                {currentUser && !isOwner && (
                  <button
                    onClick={handleFollow}
                    className={`rounded px-4 py-1 text-sm cursor-pointer transition-all ${
                      isFollowing
                        ? "bg-blue-500/50 text-white hover:bg-red-500/30"
                        : "bg-blue-500/30 text-slate-900 dark:text-gray-300 hover:bg-blue-500/40"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>

            {/* Creator Actions Panel */}
            {isAuthor && (
              <div className="flex flex-wrap gap-3 mb-6 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                <button
                  onClick={() => {
                    setEditedTitle(post?.title || "");
                    setEditedContent(post?.content || "");
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 rounded-lg transition-all active:scale-95 cursor-pointer font-semibold"
                >
                  ✏️ Edit Story
                </button>
                <button
                  onClick={() => setShowTimeline(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 rounded-lg transition-all active:scale-95 cursor-pointer font-semibold shadow-md"
                >
                  ✨ Story Timeline & History
                </button>
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 rounded-lg transition-all active:scale-95 cursor-pointer font-semibold shadow-md"
                >
                  📊 Compare Variations
                </button>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-4 mb-12 bg-slate-900/40 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-200">✏️ Edit Story Iteration</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">STORY TITLE</label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">STORY CONTENT</label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={12}
                    className="w-full p-3 rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 font-semibold text-sm cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? "Saving Iteration..." : "Save Iteration"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className={`text-4xl font-bold text-slate-900 dark:text-gray-300 leading-tight ${post?.language ? "mb-2" : "mb-4"}`}>
                  {post?.title}
                </h1>
<div className="flex items-center gap-4 mb-6 flex-wrap">
  <StarRatingDisplay
    rating={post?.averageRating || 0}
    totalRatings={post?.totalRatings || 0}
    size="md"
  />

  {post?.language && (
    <span className="inline-flex items-center rounded-full bg-blue-950/60 text-blue-300 border border-blue-700/50 py-1 px-3 text-xs font-semibold">
      🌐 {post.language}
    </span>
  )}

  {post?.content && (
    <>
      <span className="inline-flex items-center rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/50 py-1 px-3 text-xs font-semibold gap-1 select-none">
        <span aria-hidden="true" role="img" aria-label="reading time">&#x23F1;&#xFE0F;</span> {calculateReadingTime(post.content)} min read
      </span>

      <span className="inline-flex items-center rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/50 py-1 px-3 text-xs font-semibold">
        {formatReadingStats(post.content)}
      </span>
    </>
  )}
</div>

                <div className="mb-12">
                  <ImageFallback
                    src={post?.imageURL}
                    alt={post?.title || "Story image"}
                    className="w-full h-[400px] object-cover rounded-lg shadow-md"
                  />
                </div>
                <ReaderPreferencesPanel
                  {...readerPreferences}
                  className="mb-6"
                />

                <div className={`prose mx-auto mb-12 whitespace-pre-wrap break-words text-slate-700 dark:text-gray-300 ${readerPreferences.readerClassName}`}>
                  <p>{post?.content}</p>
                </div>

                {post?.content && (
                  <div className="mb-12">
                    <AudioPlayer text={post.content} title={post.title} />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-12 dark:border-gray-500">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors cursor-pointer ${
                    hasUserReacted
                      ? "text-red-500 hover:text-red-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-gray-600 dark:hover:text-gray-400"
                  }`}
                >
                  <i
                    className={`${hasUserReacted ? "fas" : "far"} fa-heart`}
                  ></i>

                  <span>{post?.likesCount}</span>
                </button>

                {post && (
                  <BookmarkButton
                    storyId={post._id}
                    className="!border-none !px-0 bg-transparent hover:bg-transparent"
                  />
                )}
              </div>
              <div className="relative">
  <button
    onClick={() => setShowShareMenu(!showShareMenu)}
    className="px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition"
  >
    🔗 Share
  </button>
  <button
    onClick={() => setShowTranslator(true)}
    className="px-3 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-600 transition ml-2"
  >
    🌍 Translate
  </button>

  {showShareMenu && (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
      <button
        onClick={handleCopyLink}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        📋 Copy Link
      </button>

      <button
        onClick={handleTwitterShare}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        🐦 Share on X
      </button>

      <button
        onClick={handleWhatsAppShare}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        💬 WhatsApp
      </button>

      <button
        onClick={handleEmailShare}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        ✉️ Email
      </button>
    </div>
  )}
</div>
            </div>

            {id && currentUser && !isOwner && (
              <StoryRatingInput storyId={id} />
            )}

            {id && (
              <div className="mb-12">
                <PostCommentComponent postId={id} />
              </div>
            )}

            <div>
  <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-gray-300">
    Related Stories
  </h3>

  {relatedPost && relatedPost.length > 0 ? (
    <RelatedStoriesComponent
      posts={relatedPost}
      currentPostId={post?._id || ""}
    />
  ) : (
    <div className="text-center py-8 text-slate-500 dark:text-gray-400">
      <p>No related stories found.</p>
    </div>
  )}
</div>
<div className="mt-12">
  <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-gray-300">
    Similar Stories
  </h3>

  <SimilarStories
    stories={relatedPost || []}
  />
</div>
          </div>
        </div>
      </div>

      {showTimeline && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0f172a]/95 backdrop-blur-xl border-l border-slate-700/60 shadow-2xl p-6 overflow-y-auto text-white animate-slide-in flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            
            <button
              onClick={() => setShowTimeline(false)}
              className="w-8 h-8 rounded-full bg-slate-850 border border-slate-750 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              aria-label="Close story timeline"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between w-full mb-6">
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400 flex items-center gap-2">
                ✨ Story Timeline
              </h3>

              <p className="text-[11px] text-slate-400 mt-1">
                Chronological creative iterations
              </p>
            </div>

            <button
              onClick={() => setShowTree(true)}
              className="px-3 py-1 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
            >
              View Tree
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {isLoadingVersions ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-slate-400 text-sm">Loading version timeline...</p>
              </div>
            ) : versions && versions.length > 0 ? (
              <div className="relative border-l border-slate-800 pl-4 ml-2 space-y-6">
                {versions.map((v: IStoryVersion) => {
                  let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
                  if (v.generationType === "edited") badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                  else if (v.generationType === "regenerated") badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/30";
                  else if (v.generationType === "alternate-ending") badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/30";
                  else if (v.generationType === "restored") badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                  else if (v.generationType === "pre-restoration") badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/30";

                  return (
                    <div key={v._id} className="relative group">
                      <div className="absolute left-[-21px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-[#0f172a] group-hover:scale-125 transition-transform duration-200"></div>
                      <div className="bg-slate-900/55 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700/80 transition-all duration-200">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 block">
                              VERSION #{v.versionNumber}
                            </span>
                            <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border mt-1 ${badgeColor}`}>
                              {v.generationType}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRestore(v._id)}
                              disabled={isRestoring}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-[10px] rounded transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                            >
                              Restore
                            </button>

                            <button
                              onClick={() => handleCreateBranch(v._id)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] rounded transition-all"
                            >
                              Branch
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-200 mb-1">{v.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/60 font-light select-all">
                          {v.content}
                        </p>

                        {v.prompt && (
                          <p className="text-[10px] text-slate-500 mt-2 italic truncate">
                            Prompt: "{v.prompt}"
                          </p>
                        )}

                        <span className="text-[9px] text-slate-500 block mt-2">
                          🕒 {new Date(v.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                <span className="text-3xl block mb-2">📜</span>
                <h4 className="font-bold text-slate-300 mb-1 text-sm">No Iterations Saved Yet</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Direct edits or alternate ending selections will create auto-snapshots here!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison Drawer */}
      {showComparison && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-white dark:bg-[#0f172a]/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700/60 shadow-2xl p-6 overflow-y-auto animate-slide-in flex flex-col">
          <ComparisonMode
            versions={versions || []}
            isLoadingVersions={isLoadingVersions}
            onClose={() => setShowComparison(false)}
          />
        </div>
      )}

      {showTree && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Story Branch Tree
              </h3>

              <button
                onClick={() => setShowTree(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {!storyTree ? (
              <div className="text-slate-400">
                Loading...
              </div>
            ) : (
              <div className="space-y-3">
                {storyTree.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="border border-slate-700 rounded-lg p-3"
                  >
                    <div className="font-bold">
                      Version #{node.versionNumber}
                    </div>

                    <div>
                      {node.title}
                    </div>

                    {node.branchName && (
                      <div className="text-purple-400 text-sm">
                        Branch: {node.branchName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showComparison && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-white dark:bg-[#0f172a]/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700/60 shadow-2xl p-6 overflow-y-auto text-slate-900 dark:text-white animate-slide-in flex flex-col">
          <ComparisonMode
            versions={versions || []}
            isLoadingVersions={isLoadingVersions}
            onClose={() => setShowComparison(false)}
          />
        </div>
      )}

      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {showTranslator && post && (
        <StoryTranslator
          story={{
            uuid: post._id || "",
            title: post.title || "",
            content: post.content || "",
            tag: post.tag || "",
            imageURL: post.imageURL || "",
          } as IStories}
          isLogin={isLoggedIn()}
          onClose={() => setShowTranslator(false)}
        />
      )}
    </div>
  );
};

export default PostDetailsComponent;