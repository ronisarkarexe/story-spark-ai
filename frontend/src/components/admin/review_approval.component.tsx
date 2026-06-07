
import React from "react";
import toast, { Toaster } from "react-hot-toast";

import {
  useApproveReviewMutation,
  useGetPendingReviewsQuery,
} from "../../redux/apis/review.api";
import { Review } from "../../models/review";

const ReviewApprovalComponent = () => {
  const { data: reviews = [], isLoading } = useGetPendingReviewsQuery({});
  const [approveReview, { isLoading: isApproving }] = useApproveReviewMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id).unwrap();
      toast.success("Review approved successfully!");
    } catch (error: unknown) {
      toast.error("Failed to approve review. Please try again.");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-slate-500 dark:text-slate-400 text-sm font-medium">
          <i className="fa-solid fa-circle-notch animate-spin"></i>
          Loading pending reviews...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 px-4 py-12 relative overflow-hidden w-full box-border">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-6xl mx-auto relative z-10 w-full box-border">
        <div className="mb-10 max-w-2xl text-left px-0.5 select-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 mb-4 shadow-sm dark:shadow-none">
            <i className="fa-solid fa-shield-check text-xs"></i>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Moderation Desk</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pending Reviews
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Evaluate, approve, or filter user submissions before deployment into the production feedback directory stream.
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full box-border items-stretch">
            {reviews.map((review: Review) => (
              <div
                key={review._id}
                className="w-full text-left bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between box-border group"
              >
                <div className="w-full box-border">
                  <div className="flex items-center gap-4 mb-5 select-none w-full box-border">
                    <img
                      src={review.imgSrc || "https://i.pravatar.cc/150?img=33"}
                      alt={review.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-slate-200/80 dark:border-white/10 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-200 tracking-tight truncate">
                        {review.name}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                        {review.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-0.5 mb-4 select-none text-amber-400 text-sm">
                    {Array.from({ length: Math.min(review.rating || 5, 5) }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6">
                    "{review.feedback}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 w-full box-border">
                  <button
                    onClick={() => review._id && handleApprove(review._id)}
                    disabled={!review._id || isApproving}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 select-none uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-circle-check text-xs" />
                    <span>{isApproving ? "Approving..." : "Approve Review"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-10 sm:p-14 text-center box-border max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-5 border border-slate-200/60 dark:border-white/5 select-none">
              <i className="fa-solid fa-inbox text-slate-400 dark:text-slate-500 text-xl"></i>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
              Queue clear
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal">
              No pending reviews are waiting inside the staging evaluation channel buffer right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewApprovalComponent;
