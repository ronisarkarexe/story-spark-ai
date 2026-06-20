import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateCommentMutation,
  useGetCommentsListQuery,
  useToggleCommentLikeMutation,
  useDeleteCommentMutation,
  useReportCommentMutation,
} from "../../redux/apis/comment";
import { isLoggedIn, getUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import SSProfile from "../ui-component/ss-profile/ss-profile";
import { timeAgo } from "../../utils/time-formate";
import { getErrorMessage } from "../../error/error.message";

type Inputs = {
  comment: string;
};

interface IPostCommentComponentProps {
  postId: string;
}

const PostCommentComponent: React.FC<IPostCommentComponentProps> = ({
  postId,
}) => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [replyForms, setReplyForms] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const isLogin = isLoggedIn();
  const currentUser = getUserInfo();

  // Reporting state
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>("SPAM");
  const [reportDescription, setReportDescription] = useState<string>("");

  const { data: commentList } = useGetCommentsListQuery(postId);
  const [createComment] = useCreateCommentMutation();
  const [toggleCommentLike] = useToggleCommentLikeMutation();
  const [toggleCommentHelpful] = useToggleCommentHelpfulMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [reportComment, { isLoading: isReporting }] = useReportCommentMutation();

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      toast.error("Please login to report a comment.");
      return;
    }
    if (!reportingCommentId) return;

    try {
      await reportComment({
        targetId: reportingCommentId,
        targetType: "COMMENT",
        reason: reportReason,
        description: reportDescription.trim() || undefined,
      }).unwrap();
      toast.success("Comment reported successfully!");
      setReportingCommentId(null);
      setReportReason("SPAM");
      setReportDescription("");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!isLogin) {
      toast.error("Please login to post a comment.");
      return;
    }
    if (data.comment.trim() === "") {
      toast.custom((t) => (
  <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
    <span>Please enter a comment.</span>

    <button
      onClick={() => toast.dismiss(t.id)}
      className="ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition"
    >
      ×
    </button>
  </div>
));
      return;
    }
    const createPostComment = {
      postId: postId,
      comment: data.comment,
    };
    setIsBusy(true);
    try {
      const res = await createComment({ ...createPostComment }).unwrap();
      if (res) {
        toast.success("Comment posted successfully!");
        reset();
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  };

  const onReplySubmit = async (e: React.FormEvent, parentCommentId: string) => {
    e.preventDefault();
    if (!isLogin) {
      toast.error("Please login to reply.");
      return;
    }
    const replyText = replyForms[parentCommentId];
    if (!replyText || replyText.trim() === "") {
      toast.error("Please enter a reply.");
      return;
    }

    const createPostComment = {
      postId: postId,
      comment: replyText,
      parentCommentId: parentCommentId,
    };
    try {
      const res = await createComment({ ...createPostComment }).unwrap();
      if (res) {
        toast.success("Reply posted successfully!");
        setReplyForms({ ...replyForms, [parentCommentId]: "" });
        setReplyingTo(null);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const isCommentLiked = (likes: string[] | undefined) =>
    (likes as unknown[])?.some((u) =>
      typeof u === "string"
        ? u === currentUser?.userId
        : (u as { email?: string })?.email === currentUser?.email
    ) ?? false;

  const handleLike = async (commentId: string) => {
    if (!isLogin) {
      toast.error("Please login to like a comment.");
      return;
    }
    try {
      await toggleCommentLike(commentId).unwrap();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const isCommentHelpful = (helpful: string[] | undefined) =>
    (helpful as unknown[])?.some((u) =>
      typeof u === "string"
        ? u === currentUser?.userId
        : (u as { email?: string })?.email === currentUser?.email
    ) ?? false;

  const handleHelpful = async (commentId: string) => {
    if (!isLogin) {
      toast.error("Please login to react to a comment.");
      return;
    }
    try {
      await toggleCommentHelpful(commentId).unwrap();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };
  const handleDeleteComment = async (commentId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmed) return;

  try {
    await deleteComment(commentId).unwrap();
    toast.success("Comment deleted successfully!");
  } catch (err: unknown) {
    toast.error(getErrorMessage(err));
  }
};
  return (
    <div>
      <form className="mb-8" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("comment")}
          className="w-full bg-gray-100/80 border border-gray-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-slate-400 transition-all shadow-inner dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
          rows={3}
          placeholder="Share your thoughts on this story..."
        ></textarea>
        <button
          type="submit"
          className={`!rounded-button mt-3 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md ${
            isBusy
              ? "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400"
              : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 cursor-pointer"
          }`}
          disabled={isBusy}
        >
          {isBusy ? "Posting..." : "Post Comment"}
        </button>
      </form>
      <h3 className="text-2xl font-bold mb-8 text-slate-900 tracking-tight border-t border-gray-200 pt-8 dark:text-slate-200 dark:border-slate-700/50">
        Comments ({commentList?.totalComments || 0})
      </h3>
      <div className="space-y-6">
        {commentList?.comments.map((comment) => (
          <div key={comment._id} className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <SSProfile name={comment?.userId?.name || "Unknown User"} size="w-10 h-10" />
              <div className="flex-1">
                <div className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition-colors dark:bg-slate-800/40 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-600 text-lg dark:text-blue-400">
                      {comment?.userId?.name || "Unknown User"}
                    </h4>
                    <span className="text-sm text-slate-500 font-medium dark:text-slate-500">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mt-2 dark:text-slate-300">{comment.comment}</p>
                </div>
                <div className="flex items-center mt-3 pl-2 space-x-4 text-sm text-slate-500 font-medium dark:text-slate-500">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className={`hover:text-red-400 transition-colors flex items-center gap-1 ${isCommentLiked(comment.likes) ? "text-red-400" : ""}`}
                  >
                    <i className={`${isCommentLiked(comment.likes) ? "fas" : "far"} fa-heart mr-1`}></i>
                    {comment.likes?.length || 0}
                  </button>
                  <button
                    onClick={() => handleHelpful(comment._id)}
                    className={`hover:text-amber-500 transition-colors flex items-center gap-1 ${isCommentHelpful(comment.helpful) ? "text-amber-500" : ""}`}
                  >
                    <i className={`${isCommentHelpful(comment.helpful) ? "fas" : "far"} fa-lightbulb mr-1`}></i>
                    Helpful ({comment.helpful?.length || 0})
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    className="hover:text-blue-400 transition-colors"
                  >
                  
                    <i className="far fa-comment mr-1"></i> Reply
                  </button>
                  {currentUser?.userId === comment?.userId?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <i className="far fa-trash-alt mr-1"></i> Delete
                    </button>
                  )}
                  {currentUser?.userId !== comment?.userId?._id && (
                    <button
                      onClick={() => {
                        if (!isLogin) {
                          toast.error("Please login to report a comment.");
                          return;
                        }
                        setReportingCommentId(comment._id);
                      }}
                      className="hover:text-amber-500 transition-colors flex items-center gap-1"
                    >
                      <i className="far fa-flag mr-1"></i> Report
                    </button>
                  )}
                </div>

                {replyingTo === comment._id && (
                  <form className="mt-4 flex space-x-3" onSubmit={(e) => onReplySubmit(e, comment._id)}>
                    <input
                      type="text"
                      value={replyForms[comment._id] || ""}
                      onChange={(e) => setReplyForms({ ...replyForms, [comment._id]: e.target.value })}
                      placeholder="Write a reply..."
                      className="flex-1 bg-gray-100/80 border border-gray-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-200"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Reply
                    </button>
                  </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4 border-l-2 border-gray-200 pl-4 ml-2 dark:border-slate-700">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="flex space-x-3">
                        <SSProfile name={reply?.userId?.name || "Unknown User"} size="w-8 h-8" />
                        <div className="flex-1">
                          <div className="rounded-lg p-3 border border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/20">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">
                                {reply?.userId?.name || "Unknown User"}
                              </h4>
                              <span className="text-xs text-slate-500 dark:text-slate-500">
                                {timeAgo(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-slate-600 text-sm dark:text-slate-300">{reply.comment}</p>
                          </div>
                          <div className="flex items-center mt-1 space-x-4 text-xs text-slate-500">
                            <button
                              onClick={() => handleLike(reply._id)}
                              className={`hover:text-red-400 transition-colors ${isCommentLiked(reply.likes) ? "text-red-400" : ""}`}
                            >
                              <i className={`${isCommentLiked(reply.likes) ? "fas" : "far"} fa-heart mr-1`}></i>
                              {reply.likes?.length || 0}
                            </button>
                            {currentUser?.userId !== reply?.userId?._id && (
                              <button
                                onClick={() => {
                                  if (!isLogin) {
                                    toast.error("Please login to report a comment.");
                                    return;
                                  }
                                  setReportingCommentId(reply._id);
                                }}
                                className="hover:text-amber-500 transition-colors flex items-center gap-1"
                              >
                                <i className="far fa-flag mr-1"></i> Report
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {reportingCommentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i className="fas fa-flag text-amber-500"></i> Report Comment
              </h3>
              <button
                onClick={() => {
                  setReportingCommentId(null);
                  setReportReason("SPAM");
                  setReportDescription("");
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Why are you reporting this comment?
                </label>
                <div className="space-y-2">
                  {[
                    { value: "SPAM", label: "Spam or misleading" },
                    { value: "HATE_SPEECH", label: "Hate speech or harassment" },
                    { value: "INAPPROPRIATE", label: "Inappropriate or explicit content" },
                    { value: "MISINFORMATION", label: "Misinformation" },
                    { value: "OTHER", label: "Other issue" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={option.value}
                        checked={reportReason === option.value}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                      />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Provide more context (max 1000 characters)..."
                  maxLength={1000}
                  rows={3}
                  className="w-full border border-gray-200 dark:border-slate-800 rounded-lg p-3 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReportingCommentId(null);
                    setReportReason("SPAM");
                    setReportDescription("");
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  disabled={isReporting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                  disabled={isReporting}
                >
                  {isReporting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default PostCommentComponent;
