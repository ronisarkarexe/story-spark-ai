import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  useDeletePostMutation,
  useGetPostByIdQuery,
  useGetPostByTagQuery,
} from "../../redux/apis/post.api";

import RelatedStoriesComponent from "./related.stories.view.component";
import PostCommentComponent from "./post.comment.component";

import LoadingAnimation from "../loading/loading.component";
import SSProfile from "../ui-component/ss-profile/ss-profile";
import BookmarkButton from "../BookmarkButton";

import { formatDateShort } from "../../utils/time-formate";
import { getUserInfo } from "../../services/auth.service";

import { useToggleReactionMutation } from "../../redux/apis/reaction.api";

import {
  useToggleFollowMutation,
  useGetFollowStatusQuery,
} from "../../redux/apis/user.api";

import { toast } from "react-hot-toast";

import { FaXTwitter } from "react-icons/fa6";

const PostDetailsComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: post, isLoading } = useGetPostByIdQuery(id || "");

  const tag = post?.tag;
  const { data: relatedPost } = useGetPostByTagQuery({
    tag: tag || "",
    excludeId: post?._id || "",
  });

  const [toggleReaction] = useToggleReactionMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const currentUser = getUserInfo();

  const authorId = post?.author?._id;
  const isOwner = Boolean(
    currentUser?.email && post?.author?.email === currentUser.email
  );

  const { data: followData } = useGetFollowStatusQuery(authorId || "", {
    skip: !authorId || !currentUser,
  });

  const [toggleFollow] = useToggleFollowMutation();

  const isFollowing = followData?.isFollowing ?? false;

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

  const hasUserReacted = post?.reactions?.some((r) => {
    const userId = r.userId;

    const email =
      typeof userId === "object" &&
      userId !== null &&
      "email" in userId
        ? userId.email
        : undefined;

    return email === currentUser?.email;
  });

  const shareUrl = window.location.href;

  const shareTitle = post?.title || "Check out this story!";

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareTitle)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEmailShare = () => {
    const subject = `Story Spark AI - ${shareTitle}`;

    const body = `Check out this interesting story on Story Spark AI: "${shareTitle}"\n\nRead it here: ${shareUrl}`;

    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = url;
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
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-6 flex justify-between">
          <div
            onClick={() => navigate(-1)}
            className="!rounded-button bg-gray-100/80 hover:bg-gray-200/80 text-slate-900 dark:bg-white/20 dark:hover:bg-white/30 dark:text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded border border-gray-200 dark:border-white/10"
          >
            <i className="fa-solid fa-left-long"></i> BACK
          </div>

          <div></div>
        </div>

        <div className="rounded-lg shadow-sm bg-gray-50 border border-gray-200 text-slate-900 mb-10 dark:bg-blue-500/10 dark:border-transparent dark:text-white">
          <div className="p-8">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4 mb-6">
                <SSProfile
                  name={post?.author?.name || "Unknown User"}
                  size="h-12 w-12"
                />

                <div>
                  <h3 className="font-medium text-slate-700 dark:text-gray-400">
                    {post?.author?.name || "Unknown User"}
                  </h3>

                  <div className="flex items-center text-sm text-slate-500 dark:text-gray-500">
                    <span>{formatDateShort(post ? post?.createdAt : "")}</span>
                  </div>
                </div>
              </div>
              <div>
                {isOwner && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="mt-2 mr-3 rounded border border-red-500/40 px-4 py-1 text-sm text-red-300 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? "Removing..." : "Remove Story"}
                  </button>
                )}
                {currentUser && !isOwner && (
                  <button
                    onClick={handleFollow}
                    className={`mt-2 rounded px-4 py-1 text-sm cursor-pointer transition-all ${
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

            <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-300 mb-6">
              {post?.title}
            </h1>

            <div className="mb-12">
              <img
                src={post?.imageURL}
                alt={post?.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>

            <div className="prose max-w-none mb-12 text-slate-600 dark:text-gray-400">
              <p>{post?.content}</p>
            </div>

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
                    bookmarks={post.bookmarks}
                    className="!border-none !px-0 bg-transparent hover:bg-transparent"
                  />
                )}
              </div>

              <div className="flex items-center space-x-3 bg-slate-800/40 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 select-none">
                  Share:
                </span>

                <button
                  id="share-twitter-btn"
                  onClick={handleTwitterShare}
                  className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 hover:border-blue-400 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Share on X"
                >
                  <FaXTwitter className="text-sm" />
                </button>

                <button
                  id="share-linkedin-btn"
                  onClick={handleLinkedInShare}
                  className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 hover:border-indigo-400 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Share on LinkedIn"
                >
                  <i className="fab fa-linkedin text-sm"></i>
                </button>

                <button
                  id="share-email-btn"
                  onClick={handleEmailShare}
                  className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 hover:border-purple-400 hover:bg-purple-500/10 text-slate-400 hover:text-purple-400 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Share via Email"
                >
                  <i className="far fa-envelope text-sm"></i>
                </button>
              </div>
            </div>

            {id && (
              <div className="mb-12">
                <PostCommentComponent postId={id} />
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-gray-300">
                Related Stories
              </h3>

              <RelatedStoriesComponent
                posts={relatedPost || []}
                currentPostId={post?._id || ""}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default PostDetailsComponent;
