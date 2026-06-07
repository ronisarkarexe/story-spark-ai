import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateCommentMutation,
  useGetCommentsListQuery,
  useToggleCommentLikeMutation,
  useDeleteCommentMutation,
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

  const { data: commentList } = useGetCommentsListQuery(postId);
  const [createComment] = useCreateCommentMutation();
  const [toggleCommentLike] = useToggleCommentLikeMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!isLogin) {
      toast.error("Please login to post a comment.");
      return;
    }
    if (data.comment.trim() === "") {
      toast.error("Please enter a comment.");
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
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default PostCommentComponent;
