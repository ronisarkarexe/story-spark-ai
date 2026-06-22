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
    <div className="mt-12 max-w-xl mx-auto bg-blue-500/10 p-8 rounded-xl">
      <h3 className="text-xl font-bold text-slate-900 dark:text-gray-300 mb-6">
        Share Your Experience
      </h3>

      {success && (
        <div aria-live="polite" className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          Thank you! Your review has been submitted for approval.
        </div>
      )}

      {errors.submit && (
        <div aria-live="polite" className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-invalid={!!errors.role}
            aria-describedby={errors.role ? "role-error" : undefined}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.role && <p id="role-error" className="text-red-500 text-xs mt-1">{errors.role}</p>}
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-1">
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
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 text-right">{feedback.length}/500</p>
          {errors.feedback && <p id="feedback-error" className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-1">
            Rating <span className="text-red-500">*</span>
          </label>
          <StarRating rating={rating} setRating={setRating} />
          {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;