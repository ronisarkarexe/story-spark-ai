import React, { useEffect, useState, useCallback } from "react";
import { useCreateReviewMutation } from "../../../redux/apis/review.api";

const ratingLabels = [
  "",
  "Poor",
  "Fair",
  "Good",
  "Great",
  "Excellent",
];
const StarRating = ({ rating, setRating }: { rating: number; setRating: (n: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className={`text-2xl transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md ${
          star <= rating ? "text-yellow-400 drop-shadow-sm" : "text-slate-300 dark:text-slate-600"
        }`}
        aria-label={`Rate ${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);
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

  const renderStarIcon = (index: number) => {
    if (rating >= index) return <i className="fa-solid fa-star" />;
    if (rating >= index - 0.5) return <i className="fa-solid fa-star-half-stroke" />;
    return <i className="fa-regular fa-star" />;
  };

  const handleClick = (value: number) => {
    setRating(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="relative text-3xl text-gray-600 hover:scale-105 transition-all duration-150"
            onMouseLeave={() => setHovered(0)}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 ${
                star <= Math.ceil(hovered || rating) ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]" : "text-gray-600"
              }`}
            >
              {renderStarIcon(star)}
            </div>

            {/* left half (0.5) */}
            <button
              type="button"
              aria-label={`Rate ${star - 0.5} stars`}
              onMouseEnter={() => setHovered(star - 0.5)}
              onClick={() => handleClick(star - 0.5)}
              className="absolute left-0 top-0 h-full w-1/2 bg-transparent"
            />

            {/* right half (full star) */}
            <button
              type="button"
              aria-label={`Rate ${star} stars`}
              onMouseEnter={() => setHovered(star)}
              onClick={() => handleClick(star)}
              className="absolute right-0 top-0 h-full w-1/2 bg-transparent"
            />
          </div>
        ))}
      </div>

      {(hovered || rating) > 0 && (
        <p className="text-xs font-semibold tracking-wide text-yellow-400">
          {ratingLabels[Math.round(hovered || rating) || 0]}
        </p>
      )}
    </div>
  );
};

  const handleClick = (value: number) => {
    setRating(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="relative text-3xl text-gray-600 hover:scale-105 transition-all duration-150"
            onMouseLeave={() => setHovered(0)}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 ${
                star <= Math.ceil(hovered || rating) ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]" : "text-gray-600"
              }`}
            >
              {renderStarIcon(star)}
            </div>

            {/* left half (0.5) */}
            <button
              type="button"
              aria-label={`Rate ${star - 0.5} stars`}
              onMouseEnter={() => setHovered(star - 0.5)}
              onClick={() => handleClick(star - 0.5)}
              className="absolute left-0 top-0 h-full w-1/2 bg-transparent"
            />

            {/* right half (full star) */}
        const StarRating = ({
          rating,
          setRating,
        }: {
          rating: number;
          setRating: (n: number) => void;
        }) => {
      </div>

      {(hovered || rating) > 0 && (
        <p className="text-xs font-semibold tracking-wide text-yellow-400">
          {ratingLabels[Math.round(hovered || rating) || 0]}
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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!role.trim()) newErrors.role = "Role is required";
    if (!feedback.trim()) newErrors.feedback = "Review is required";
    if (feedback.length > 500) newErrors.feedback = "Max 500 characters";
    if (rating < 0.5) newErrors.rating = "Please select a rating";

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

        {success && (
          <div aria-live="polite" className="mb-4 p-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs text-center font-medium">
            Thank you! Your review has been submitted for approval.
          </div>
        )}

        {errors.submit && (
          <div aria-live="polite" className="mb-4 p-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 rounded-lg text-xs text-center font-medium">
            {errors.submit}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name *"
                aria-invalid={!!errors.name}
                className="premium-input w-full px-3 py-2 text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)] rounded-lg"
              />
              {errors.name && <p className="text-rose-500 text-[10px] mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="role" className="sr-only">Role</label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Your Role (e.g. Fiction Writer) *"
                aria-invalid={!!errors.role}
                className="premium-input w-full px-3 py-2 text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)] rounded-lg"
              />
              {errors.role && <p className="text-rose-500 text-[10px] mt-1 font-medium">{errors.role}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="feedback" className="sr-only">Review</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How has Story Spark AI helped your writing process? *"
              rows={2}
              maxLength={500}
              aria-invalid={!!errors.feedback}
              className="premium-input w-full px-3 py-2 min-h-[60px] max-h-[120px] resize-y text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)] rounded-lg"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.feedback ? (
                <p className="text-rose-500 text-[10px] font-medium">{errors.feedback}</p>
              ) : <span />}
              {errors.rating && !errors.feedback && <p className="text-rose-500 text-[10px] font-medium">{errors.rating}</p>}
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium ml-auto">{feedback.length}/500</p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="py-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              {isLoading ? "Submitting..." : "Submit Review"}
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
  );
};

export default ReviewForm;
