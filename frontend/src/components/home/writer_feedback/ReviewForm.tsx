import React, { useState, useCallback } from "react";
import { useCreateReviewMutation } from "../../../redux/apis/review.api";

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

type StarRatingProps = {
  rating: number;
  setRating: (n: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const [hovered, setHovered] = useState(0);

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
    <div
      role="radiogroup"
      aria-label="Star rating"
      tabIndex={0}
      onKeyDown={handleKey}
      className="space-y-2"
    >
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
            className={`text-3xl transition-all duration-200 hover:scale-125 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-full ${
              star <= (hovered || rating)
                ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]"
                : "text-gray-500"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {(hovered || rating) > 0 && (
        <p className="text-sm font-semibold tracking-wide text-yellow-400">
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
    } catch {
      setErrors({ submit: "Failed to submit review. Please try again." });
      setSuccess(false);
    }
  }, [createReview, name, role, feedback, rating, validate]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#0f172a]/90 to-[#111827]/90 p-6 sm:p-8 md:p-10 shadow-2xl shadow-blue-500/10 backdrop-blur-md">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
              ✍️ Share Your Story
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Share Your Experience
            </h3>

            <p className="mt-2 text-base text-gray-300">
              Your feedback helps us improve StorySparkAI for everyone.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div
              aria-live="polite"
              className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/20 p-4 text-base text-green-300 transition-all duration-300"
            >
              <span className="text-xl">🎉</span>
              <span className="font-medium">
                Thank you! Your review has been submitted for approval.
              </span>
            </div>
          )}

          {/* Error */}
          {errors.submit && (
            <div
              aria-live="polite"
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/20 p-4 text-base text-red-300"
            >
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{errors.submit}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-200"
              >
                <span className="text-blue-400">👤</span>
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
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />

              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-sm font-medium text-red-400">
                  <span>⚠</span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-200"
              >
                <span className="text-blue-400">💼</span>
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
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />

              {errors.role && (
                <p className="mt-1.5 flex items-center gap-1 text-sm font-medium text-red-400">
                  <span>⚠</span>
                  {errors.role}
                </p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <label
                htmlFor="feedback"
                className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-200"
              >
                <span className="text-blue-400">💬</span>
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
                className="w-full resize-y rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />

              <div className="mt-2 flex items-center justify-between w-full">
                {errors.feedback ? (
                  <p className="flex items-center gap-1 text-sm font-medium text-red-400">
                    <span>⚠</span>
                    {errors.feedback}
                  </p>
                ) : (
                  <span />
                )}

                <p
                  className={`text-sm font-medium ${
                    feedback.length > 450 ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  {feedback.length}/500
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <label className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-200">
                <span className="text-blue-400">⭐</span>
                Rating
                <span className="text-red-400">*</span>
              </label>

              <StarRating rating={rating} setRating={setRating} />

                <StarRating rating={rating} setRating={setRating} />

                <p className="mt-3 text-sm text-gray-400">
                  Select a rating based on your overall experience.
                </p>

                {errors.rating && (
                  <p className="mt-2 flex items-center gap-1 text-sm font-medium text-red-400">
                    <span>⚠</span>
                    {errors.rating}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-lg font-bold tracking-wide text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
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
    </div>
  );
};

export default ReviewForm;
