import React, { useState } from "react";
import { useCreateReviewMutation } from "../../../redux/apis/review.api";

const StarRating = ({ rating, setRating }: { rating: number; setRating: (n: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        aria-label={`Rate ${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);

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
      await createReview({ name, role, feedback, rating }).unwrap();
      setSuccess(true);
      setName(""); setRole(""); setFeedback(""); setRating(0); setErrors({});
    } catch {
      setErrors({ submit: "Failed to submit review. Please try again." });
    }
  };

  return (
    <div className="writer-feedback-form story-panel mx-auto mt-14 max-w-xl rounded-2xl p-6 sm:p-8">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Share Your Experience
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tell us how Story Spark AI has shaped your writing journey.
        </p>
      </div>

      {success && (
        <div aria-live="polite" className="mb-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
          Thank you! Your review has been submitted for approval.
        </div>
      )}

      {errors.submit && (
        <div aria-live="polite" className="mb-4 rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">
          {errors.submit}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
          />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-invalid={!!errors.role}
            aria-describedby={errors.role ? "role-error" : undefined}
            placeholder="e.g. Novelist, Poet, Blogger"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
          />
          {errors.role && <p id="role-error" className="mt-1 text-xs text-red-500">{errors.role}</p>}
        </div>

        <div>
          <label htmlFor="feedback" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
            placeholder="What do you love about writing here?"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
          />
          <p className="text-right text-xs text-slate-400">{feedback.length}/500</p>
          {errors.feedback && <p id="feedback-error" className="mt-1 text-xs text-red-500">{errors.feedback}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Rating <span className="text-red-500">*</span>
          </label>
          <StarRating rating={rating} setRating={setRating} />
          {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="motion-cta w-full rounded-lg px-4 py-2.5 font-semibold disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;