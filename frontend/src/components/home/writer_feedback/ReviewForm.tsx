<<<<<<< HEAD
import React, { useCallback, useMemo, useState } from "react";
=======
import React, { useEffect, useState, useCallback } from "react";
>>>>>>> origin/main
import { useCreateReviewMutation } from "../../../redux/apis/review.api";

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

type FieldErrors = Partial<Record<"name" | "role" | "feedback" | "rating" | "submit", string>>;

type StarRatingProps = {
  rating: number;
  onChange: (nextRating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange }) => {
  const [hovered, setHovered] = useState(0);
<<<<<<< HEAD
  const activeRating = hovered || rating;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeRating;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className={`text-2xl transition-transform duration-150 focus:outline-none ${
                isFilled ? "text-yellow-400" : "text-slate-400 hover:text-yellow-300"
              }`}
            >
              ★
            </button>
          );
        })}
      </div>

      {activeRating > 0 ? (
        <p className="text-xs font-medium text-yellow-400">{STAR_LABELS[activeRating]}</p>
      ) : null}
=======

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
>>>>>>> origin/main
    </div>
  );
};

const ReviewForm: React.FC = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const [createReview, { isLoading }] = useCreateReviewMutation();

<<<<<<< HEAD
  const validate = useCallback((): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!role.trim()) nextErrors.role = "Role is required.";
    if (!feedback.trim()) nextErrors.feedback = "Review is required.";
    if (feedback.trim().length > 500) nextErrors.feedback = "Maximum 500 characters.";
    if (rating === 0) nextErrors.rating = "Please select a rating.";
=======

    if (rating === 0) newErrors.rating = "Please select a rating";
>>>>>>> origin/main

    return nextErrors;
  }, [feedback, name, rating, role]);

  const handleSubmit = useCallback(async () => {
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSuccess(false);
      return;
    }

    try {
      await createReview({
        name: name.trim(),
        role: role.trim(),
        feedback: feedback.trim(),
        rating,
        imgSrc: "",
      }).unwrap();

      setName("");
      setRole("");
      setFeedback("");
      setRating(0);
      setErrors({});
      setSuccess(true);
    } catch {
      setSuccess(false);
      setErrors({ submit: "Failed to submit review. Please try again." });
    }
  }, [createReview, feedback, name, rating, role, validate]);

  const remainingChars = useMemo(() => Math.max(0, 500 - feedback.length), [feedback.length]);

  return (
    <section aria-labelledby="review-form-heading" className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-slate-950/80 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 id="review-form-heading" className="text-lg font-semibold text-slate-900 dark:text-white">
              Share Your Experience
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Your feedback helps us improve StorySparkAI for everyone.
            </p>
          </div>

          <StarRating rating={rating} onChange={setRating} />
        </div>

        {success ? (
          <div
            aria-live="polite"
            className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-300"
          >
            Thank you! Your review has been submitted for approval.
          </div>
        ) : null}

        {errors.submit ? (
          <div
            aria-live="polite"
            className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300"
          >
            {errors.submit}
          </div>
        ) : null}

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            />
            {errors.name ? <p className="mt-1.5 text-xs text-red-500">{errors.name}</p> : null}
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Role
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Writer, reader, editor..."
              aria-invalid={Boolean(errors.role)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            />
            {errors.role ? <p className="mt-1.5 text-xs text-red-500">{errors.role}</p> : null}
          </div>

          <div>
            <label htmlFor="feedback" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Review
            </label>
            <textarea
              id="feedback"
              rows={5}
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Tell us what you liked, what felt clunky, or what we could improve."
              aria-invalid={Boolean(errors.feedback)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            />
            <div className="mt-1 flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>{remainingChars} characters left</span>
              {errors.feedback ? <span className="text-red-500">{errors.feedback}</span> : null}
            </div>
          </div>

          {errors.rating ? <p className="text-xs text-red-500">{errors.rating}</p> : null}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;
