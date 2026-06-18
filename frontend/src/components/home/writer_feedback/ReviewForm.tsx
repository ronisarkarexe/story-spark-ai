import React, { useState } from "react";
import { useCreateReviewMutation } from "../../../redux/apis/review.api";

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
    <div className="max-w-3xl mx-auto premium-glow rounded-2xl group transition-transform duration-500 hover:-translate-y-1 focus-within:-translate-y-1">
      <div className="glass-surface p-5 sm:p-6 rounded-2xl shadow-xl dark:shadow-indigo-500/10 transition-shadow duration-500 group-hover:shadow-indigo-500/20 group-focus-within:shadow-indigo-500/20 relative z-10 bg-white/70 dark:bg-slate-900/70">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              Share Your Experience
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Help us build the best creative community.
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center">
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

            <h3 className="text-2xl font-bold text-white">
            Submit Your Review
            </h3>

            <p className="mt-1 text-sm text-gray-400">
            Tell us about your experience with StorySparkAI.
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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
            <div>
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

            <div className="flex justify-end mt-6">
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
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;