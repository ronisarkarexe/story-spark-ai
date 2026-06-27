import React, { useState, useCallback } from "react";
import { useCreateReviewMutation } from "../../../redux/apis/review.api";
import { User, Briefcase, MessageSquare, Star } from "lucide-react";

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

type StarRatingProps = {
  rating: number;
  setRating: (n: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const [hovered, setHovered] = useState(0);

  // keyboard support: left/right arrows to change rating, 1-5 keys to set directly
  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") setRating(Math.max(0, rating - 1));
      if (e.key === "ArrowRight") setRating(Math.min(5, rating + 1));
      const num = parseInt(e.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= 5) setRating(num);
    },
    [rating, setRating]
  );

  return (
    <div className="space-y-2">
      <div
        role="radiogroup"
        aria-label="Star rating"
        tabIndex={0}
        onKeyDown={handleKey}
        className="flex items-center gap-2 focus:outline-none"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || rating);
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className={`text-2xl transition-all duration-150 focus-visible:outline-none rounded-md px-1 cursor-pointer ${
                filled
                  ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)] scale-110"
                  : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
              }`}
            >
              ★
            </button>
          );
        })}
      </div>

      {(hovered || rating) > 0 && (
        <p className="mt-1 text-xs font-semibold tracking-wide text-yellow-400">
          {ratingLabels[hovered || rating]}
        </p>
      )}
    </div>
  );
};

const ReviewForm: React.FC = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!role.trim()) newErrors.role = "Role is required.";
    if (!feedback.trim()) newErrors.feedback = "Review is required.";
    if (feedback.length > 500) newErrors.feedback = "Maximum 500 characters.";
    if (rating === 0) newErrors.rating = "Please select a rating.";
    return newErrors;
  }, [name, role, feedback, rating]);

  const handleSubmit = useCallback(async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
      return;
    }

    try {
      await createReview({ name, role, feedback, rating, imgSrc: "" });
      setSuccess(true);
      setName("");
      setRole("");
      setFeedback("");
      setRating(0);
      setErrors({});
    } catch (err) {
      setErrors({ submit: "Failed to submit review. Please try again." });
      setSuccess(false);
    }
  }, [createReview, name, role, feedback, rating, validate]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white">
            Share Your Experience
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Your feedback helps us improve StorySparkAI for everyone.
          </p>
        </div>

        {/* Success */}
        {success && (
          <div
            aria-live="polite"
            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400 transition-all duration-300"
          >
            <span className="text-lg">🎉</span>
            <span>
              Thank you! Your review has been submitted for approval.
            </span>
          </div>
        )}

        {/* Error */}
        {errors.submit && (
          <div
            aria-live="polite"
            className="mb-6 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400"
          >
            <span className="text-lg">⚠️</span>
            <span>{errors.submit}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <User className="w-[18px] h-[18px] text-slate-400" />
              Name
              <span className="text-red-400">*</span>
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              aria-invalid={!!errors.name}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
            />

            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                <span>⚠</span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <Briefcase className="w-[18px] h-[18px] text-slate-400" />
              Role
              <span className="text-red-400">*</span>
            </label>

            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Fantasy Writer, Student, Blogger"
              aria-invalid={!!errors.role}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
            />

            {errors.role && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                <span>⚠</span>
                {errors.role}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label
              htmlFor="feedback"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <MessageSquare className="w-[18px] h-[18px] text-slate-400" />
              Review
              <span className="text-red-400">*</span>
            </label>

            <textarea
              id="feedback"
              rows={5}
              maxLength={500}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience with StorySparkAI..."
              aria-invalid={!!errors.feedback}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-none"
            />

            <div className="mt-1 flex items-center justify-between">
              {errors.feedback ? (
                <p className="flex items-center gap-1 text-xs text-rose-400">
                  <span>⚠</span>
                  {errors.feedback}
                </p>
              ) : (
                <span />
              )}

              <p
                className={`text-xs ${
                  feedback.length > 450 ? "text-yellow-400" : "text-slate-500"
                }`}
              >
                {feedback.length}/500
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="pb-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Star className="w-[18px] h-[18px] text-slate-400" />
              Rating
              <span className="text-red-400">*</span>
            </label>

            <StarRating rating={rating} setRating={setRating} />

            {errors.rating && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                <span>⚠</span>
                {errors.rating}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-8 pb-2 sm:pb-0">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-auto rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Share Review ✨"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
