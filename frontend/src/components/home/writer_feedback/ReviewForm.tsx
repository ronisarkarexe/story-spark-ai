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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hovered || rating);

          return (
            <button
              key={star}
              type="button"
              aria-pressed={rating === star}
              aria-label={`Rate ${star} star`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className={`rounded-full p-1 text-3xl leading-none transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                isActive
                  ? "text-amber-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                  : "text-slate-500 hover:text-amber-300"
              }`}
            >
              ★
            </button>
          );
        })}
      </div>

      {(hovered || rating) > 0 && (
        <p className="text-sm font-semibold tracking-[0.2em] text-amber-300">
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
    <div className="mx-auto w-full max-w-2xl px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0f172a]/95 to-[#111827]/95 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.45)] shadow-blue-500/10 backdrop-blur-xl sm:p-8 md:p-10">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
              ✍️ Share Your Story
            </div>

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
              className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400 transition-all duration-300"
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
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
            >
              <span className="text-lg">⚠️</span>
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="space-y-5 sm:space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-200"
                >
                  <span className="text-blue-400">👤</span>
                  Full Name
                  <span className="text-rose-400">*</span>
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  aria-invalid={!!errors.name}
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3.5 text-sm text-slate-100 shadow-inner shadow-black/20 placeholder:text-slate-400 transition-all duration-200 focus:border-blue-400 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
                  className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-200"
                >
                  <span className="text-blue-400">💼</span>
                  Your Role
                  <span className="text-rose-400">*</span>
                </label>

                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Fantasy Writer, Student, Blogger"
                  aria-invalid={!!errors.role}
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3.5 text-sm text-slate-100 shadow-inner shadow-black/20 placeholder:text-slate-400 transition-all duration-200 focus:border-blue-400 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />

                {errors.role && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                    <span>⚠</span>
                    {errors.role}
                  </p>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label
                htmlFor="feedback"
                className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-200"
              >
                <span className="text-blue-400">💬</span>
                Your Review
                <span className="text-rose-400">*</span>
              </label>

              <textarea
                id="feedback"
                rows={5}
                maxLength={500}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience with StorySparkAI..."
                aria-invalid={!!errors.feedback}
                className="min-h-[150px] w-full resize-none rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3.5 text-sm text-slate-100 shadow-inner shadow-black/20 placeholder:text-slate-400 transition-all duration-200 focus:border-blue-400 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />

              <div className="mt-2 flex items-center justify-between">
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
                    feedback.length > 450 ? "text-amber-400" : "text-slate-500"
                  }`}
                >
                  {feedback.length}/500
                </p>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-200">
                <span className="text-blue-400">⭐</span>
                Your Rating
                <span className="text-rose-400">*</span>
              </label>

              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-inner shadow-black/20 sm:p-5">
                <StarRating rating={rating} setRating={setRating} />

                <p className="mt-3 text-sm text-slate-400">
                  Select a rating based on your overall experience.
                </p>
              </div>

              {errors.rating && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                  <span>⚠</span>
                  {errors.rating}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:w-auto"
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
    </div>
  );
};

export default ReviewForm;
