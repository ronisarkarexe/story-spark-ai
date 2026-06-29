import React, { useEffect, useState, useCallback } from "react";
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

const ReviewForm: React.FC = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [createReview, { isLoading }] = useCreateReviewMutation();


    if (rating === 0) newErrors.rating = "Please select a rating";

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
      // keep error message generic
      setErrors({ submit: "Failed to submit review. Please try again." });
      setSuccess(false);
    }
  }, [createReview, name, role, feedback, rating, validate]);

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
    <section aria-labelledby="review-form-heading" className="max-w-3xl mx-auto">
      {/* Variant wrapper: light card vs dark/glass card */}
      <div
        className={`rounded-2xl transition-transform duration-300 focus-within:-translate-y-0.5 ${
          isDark
            ? "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a]/80 to-[#111827]/80 p-6 sm:p-8 md:p-10 shadow-2xl shadow-blue-500/10 backdrop-blur-md"
            : "glass-surface p-5 sm:p-6 rounded-2xl shadow-xl bg-white/70"
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="review-form-heading" className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Share Your Experience
            </h2>
            <p className={`mt-1 text-sm ${isDark ? "text-gray-300" : "text-slate-500"}">Your feedback helps us improve StorySparkAI for everyone.</p>
          </div>

          <div className="flex-shrink-0">
            <StarRating rating={rating} setRating={setRating} />
          </div>
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

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300"
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
                className="w-full max-w-lg rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                  <span>⚠</span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300"
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
                className="w-full max-w-lg rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              {errors.role && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                  <span>⚠</span>
                  {errors.role}
                </p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <label
                htmlFor="feedback"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300"
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
                className="w-full max-w-lg resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              <div className="mt-1 flex items-center justify-between max-w-lg">
                {errors.feedback ? (
                  <p className="flex items-center gap-1 text-xs text-red-400">
                    <span>⚠</span>
                    {errors.feedback}
                  </p>
                ) : (
                  <span />
                )}

                <p
                  className={`text-xs ${
                    feedback.length > 450 ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  {feedback.length}/500
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="pb-8">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-blue-400">⭐</span>
                Rating
                <span className="text-red-400">*</span>
              </label>

              <StarRating rating={rating} setRating={setRating} />

              <p className="mt-2 text-xs text-gray-500">
                Select a rating based on your overall experience.
              </p>

              {errors.rating && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
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
                className="w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

            <h3 className="text-xl font-semibold text-white">
              Write a Review
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Tell us what you think about StorySparkAI.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div role="status" aria-live="polite" className={`rounded-md p-3 text-sm ${isDark ? "bg-green-900/30 text-green-200" : "bg-emerald-50 text-emerald-700"}`}>
              🎉 Thank you! Your review has been submitted for approval.
            </div>
          )}

          {errors.submit && (
            <div role="alert" aria-live="polite" className={`rounded-md p-3 text-sm mt-2 ${isDark ? "bg-red-900/30 text-red-300" : "bg-rose-50 text-rose-700"}`}>
              ⚠ {errors.submit}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-6 grid grid-cols-1 gap-4"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="review-name" className="sr-only">
                Name
              </label>
              <input
                id="review-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "error-name" : undefined}
                className={`w-full rounded-lg px-3 py-2 text-sm transition ${isDark ? "bg-white/5 text-white placeholder-gray-400" : "bg-white text-slate-900 placeholder-slate-400"}`}
              />
              {errors.name && (
                <p id="error-name" className="mt-1 text-xs text-rose-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="review-role" className="sr-only">
                Role
              </label>
              <input
                id="review-role"
                name="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Your role (e.g. Fiction Writer) *"
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "error-role" : undefined}
                className={`w-full rounded-lg px-3 py-2 text-sm transition ${isDark ? "bg-white/5 text-white placeholder-gray-400" : "bg-white text-slate-900 placeholder-slate-400"}`}
              />
              {errors.role && (
                <p id="error-role" className="mt-1 text-xs text-rose-400" role="alert">
                  {errors.role}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="review-feedback" className="sr-only">
              Review
            </label>
            <textarea
              id="review-feedback"
              name="feedback"
              rows={4}
              maxLength={500}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How has Story Spark AI helped your writing process? *"
              aria-invalid={!!errors.feedback}
              aria-describedby={errors.feedback ? "error-feedback" : "feedback-help"}
              className={`w-full rounded-lg px-3 py-2 text-sm transition resize-y ${isDark ? "bg-white/5 text-white placeholder-gray-400" : "bg-white text-slate-900 placeholder-slate-400"}`}
            />

            <div className="mt-1 flex items-center justify-between text-xs">
              {errors.feedback ? (
                <p id="error-feedback" className="text-rose-400" role="alert">
                  {errors.feedback}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="pb-8">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-blue-400">⭐</span>
                Rating
                <span className="text-red-400">*</span>
              </label>

              <span className={`${feedback.length > 450 ? "text-yellow-400" : isDark ? "text-gray-300" : "text-slate-400"}`}>
                {feedback.length}/500
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`${isDark ? "text-white" : "text-slate-700"} font-medium`}>Rating</span>
                  {errors.rating && <span className="text-xs text-rose-400">• {errors.rating}</span>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${isDark ? "bg-blue-600/90 hover:bg-blue-500/90" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"} disabled:opacity-60`}
                >
                  {isLoading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : null}

                  {isLoading ? "Submitting..." : isDark ? "Share Review" : "Share Review ✨"}
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-8 pb-2 sm:pb-0">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
        </form>
      </div>
    </div>
  
</div>
  );
    </div>
  );
};

export default ReviewForm;
