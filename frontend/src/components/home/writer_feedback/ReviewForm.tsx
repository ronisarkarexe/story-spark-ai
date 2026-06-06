import React, { useState } from "react";
import { useCreateReviewMutation } from "../../../redux/apis/review.api";

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (n: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-pressed={rating === star}
            aria-label={`Rate ${star} star`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`text-3xl transition-all duration-200 hover:scale-125 hover:-translate-y-1 focus:outline-none ${
              star <= (hovered || rating)
                ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]"
                : "text-gray-600"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {(hovered || rating) > 0 && (
        <p className="text-xs font-semibold tracking-wide text-yellow-400">
          {ratingLabels[hovered || rating]}
        </p>
      )}
    </div>
  );
};

const ReviewForm = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!role.trim()) newErrors.role = "Role is required";
    if (!feedback.trim()) newErrors.feedback = "Review is required";
    if (feedback.length > 500) newErrors.feedback = "Max 500 characters";
    if (rating === 0) newErrors.rating = "Please select a rating";

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createReview({
        name,
        role,
        feedback,
        rating,
        imgSrc: "",
      });

      setSuccess(true);
      setName("");
      setRole("");
      setFeedback("");
      setRating(0);
      setErrors({});
    } catch {
      setErrors({
        submit: "Failed to submit review. Please try again.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a]/90 to-[#111827]/90 p-6 sm:p-8 md:p-10 shadow-2xl shadow-blue-500/10 backdrop-blur-md">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
              ✍️ Share Your Story
            </div>

            <h3 className="text-2xl font-bold text-white">
              Share Your Experience
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Your feedback helps us improve StorySparkAI for everyone.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div
              aria-live="polite"
              className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400 transition-all duration-300"
            >
              <span className="text-lg">🎉</span>
              <span>
                Thank you! Your review has been submitted for approval.
              </span>
            </div>
          )}

          {errors.submit && (
            <div aria-live="polite" className="mb-5 p-4 border border-red-500/20 bg-red-500/[0.02] text-red-600 dark:text-red-400 rounded-xl text-xs sm:text-sm font-semibold tracking-tight">
              {errors.submit}
            </div>
          )}

          <div className="space-y-4 relative z-10 w-full box-border">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-400 mb-1.5 uppercase tracking-wider select-none">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all duration-150 box-border"
              />
              {errors.name && <p id="name-error" className="text-red-500 text-xs font-semibold mt-1 tracking-tight">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-400 mb-1.5 uppercase tracking-wider select-none">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "role-error" : undefined}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all duration-150 box-border"
              />
              {errors.role && <p id="role-error" className="text-red-500 text-xs font-semibold mt-1 tracking-tight">{errors.role}</p>}
            </div>

            <div>
              <label htmlFor="feedback" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-400 mb-1.5 uppercase tracking-wider select-none">
                Review <span className="text-red-500">*</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                maxLength={500}
                aria-invalid={!!errors.feedback}
                aria-describedby={errors.feedback ? "feedback-error" : undefined}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all duration-150 box-border resize-none leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono text-right mt-1 select-none">{feedback.length}/500</p>
              {errors.feedback && <p id="feedback-error" className="text-red-500 text-xs font-semibold mt-0.5 tracking-tight">{errors.feedback}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-400 mb-1.5 uppercase tracking-wider select-none">
                Rating <span className="text-red-500">*</span>
              </label>
              <StarRating rating={rating} setRating={setRating} />
              {errors.rating && <p className="text-red-500 text-xs font-semibold mt-1 tracking-tight">{errors.rating}</p>}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 mt-4"
            >
              {isLoading ? "Submitting..." : "Share Review ✨"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
