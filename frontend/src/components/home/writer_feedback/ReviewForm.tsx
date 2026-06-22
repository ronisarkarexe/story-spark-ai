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
    <div className="flex flex-col items-center sm:items-start gap-1">
      <div
        role="radiogroup"
        aria-label="Star rating"
        tabIndex={0}
        onKeyDown={handleKey}
        className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
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
              className={`text-3xl transition-all duration-150 focus-visible:outline-none rounded-md px-0.5 cursor-pointer ${
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
        <p className="text-xs font-semibold tracking-wide text-yellow-400 select-none">
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
    if (!name.trim()) newErrors.name = "Name is required";
    if (!role.trim()) newErrors.role = "Role is required";
    if (!feedback.trim()) newErrors.feedback = "Review content is required";
    if (feedback.length > 500) newErrors.feedback = "Maximum 500 characters allowed";
    if (rating === 0) newErrors.rating = "Please select a rating";
    return newErrors;
  }, [name, role, feedback, rating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
      return;
    }

    try {
      await createReview({ name, role, feedback, rating, imgSrc: "" }).unwrap();
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
  };

  return (
    <section aria-labelledby="review-form-heading" className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f172a]/90 dark:to-[#111827]/90 dark:shadow-blue-500/5">
        {/* Background Glows for Dark Mode */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl opacity-0 dark:opacity-100" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl opacity-0 dark:opacity-100" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                ✍️ Share Your Story
              </div>
              <h2 id="review-form-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
                Write a Review
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
                Tell us what you think about StorySparkAI.
              </p>
            </div>
            <div className="sm:self-end">
              <StarRating rating={rating} setRating={setRating} />
              {errors.rating && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.rating}</p>}
            </div>
          </div>

          {/* Success Notification */}
          {success && (
            <div aria-live="polite" className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-sm text-center font-semibold">
              🎉 Thank you! Your review has been submitted for approval.
            </div>
          )}

          {/* Submission Error Notification */}
          {errors.submit && (
            <div aria-live="polite" className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-400 rounded-xl text-sm text-center font-semibold">
              ⚠ {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="review-name" className="sr-only">Name</label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name *"
                  aria-invalid={!!errors.name}
                  className="w-full rounded-xl px-4 py-3 text-sm border border-slate-200 bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:ring-blue-500/40 transition-all font-medium"
                />
                {errors.name && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="review-role" className="sr-only">Role</label>
                <input
                  id="review-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Your role (e.g. Fiction Writer) *"
                  aria-invalid={!!errors.role}
                  className="w-full rounded-xl px-4 py-3 text-sm border border-slate-200 bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:ring-blue-500/40 transition-all font-medium"
                />
                {errors.role && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.role}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="review-feedback" className="sr-only">Review</label>
              <textarea
                id="review-feedback"
                rows={4}
                maxLength={500}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="How has Story Spark AI helped your writing process? *"
                aria-invalid={!!errors.feedback}
                className="w-full rounded-xl px-4 py-3 text-sm border border-slate-200 bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:ring-blue-500/40 transition-all resize-y font-medium"
              />
              <div className="flex justify-between items-center mt-1 text-xs">
                {errors.feedback ? (
                  <p className="text-rose-500 font-medium">{errors.feedback}</p>
                ) : <span />}
                <p className="text-slate-400 dark:text-gray-500 font-medium ml-auto">
                  {feedback.length}/500
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed dark:from-blue-600 dark:to-indigo-600 dark:shadow-none dark:hover:from-blue-500 dark:hover:to-indigo-500"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin" /> Submitting...
                  </span>
                ) : (
                  "Share Review ✨"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;
