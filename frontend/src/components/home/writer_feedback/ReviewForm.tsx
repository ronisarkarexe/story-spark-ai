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
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`text-3xl transition-all duration-150 hover:scale-125 focus:outline-none ${
              star <= (hovered || rating)
                ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]"
                : "text-gray-600"
            }`}
            aria-label={`Rate ${star} star`}
          >
            ★
          </button>
        ))}
      </div>
      {(hovered || rating) > 0 && (
        <p className="text-xs font-semibold text-yellow-400 tracking-wide">
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
  imgSrc: ""
})/*.unwrap();  */
      setSuccess(true);
      setName("");
      setRole("");
      setFeedback("");
      setRating(0);
      setErrors({});
    } catch {
      setErrors({ submit: "Failed to submit review. Please try again." });
    }
  };

  return (
<<<<<<< HEAD
    <div className="mt-12 max-w-xl mx-auto">
      {/* Card with glassmorphism */}
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a]/90 to-[#111827]/90 backdrop-blur-md shadow-2xl shadow-blue-500/10 p-8 overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
=======
    <div className="mt-12 max-w-2xl mx-auto bg-blue-500/10 p-6 sm:p-8 lg:p-10 rounded-xl">
      <h3 className="text-xl font-bold text-slate-900 dark:text-gray-300 mb-6">
        Share Your Experience
      </h3>
>>>>>>> 12f5312 (#1358 fix: improve ReviewForm spacing and responsiveness)

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">
              ✍️ Share Your Story
            </div>
            <h3 className="text-2xl font-bold text-white">
              Share Your Experience
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Your feedback helps us improve StorySparkAI for everyone.
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div
              aria-live="polite"
              className="mb-6 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm animate-fade-in"
            >
              <span className="text-lg">🎉</span>
              <span>Thank you! Your review has been submitted for approval.</span>
            </div>
          )}

          {/* Error message */}
          {errors.submit && (
            <div
              aria-live="polite"
              className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm"
            >
              <span className="text-lg">⚠️</span>
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
              >
                <span className="text-blue-400">👤</span>
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              {errors.name && (
                <p id="name-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.name}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
              >
                <span className="text-blue-400">💼</span>
                Role <span className="text-red-400">*</span>
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Fantasy Writer, Student, Blogger"
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "role-error" : undefined}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              {errors.role && (
                <p id="role-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.role}
                </p>
              )}
            </div>

            {/* Review */}
            <div>
              <label
                htmlFor="feedback"
                className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
              >
                <span className="text-blue-400">💬</span>
                Review <span className="text-red-400">*</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Tell us about your experience with StorySparkAI..."
                aria-invalid={!!errors.feedback}
                aria-describedby={errors.feedback ? "feedback-error" : undefined}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.feedback ? (
                  <p id="feedback-error" className="text-red-400 text-xs flex items-center gap-1">
                    <span>⚠</span> {errors.feedback}
                  </p>
                ) : (
                  <span />
                )}
                <p className={`text-xs ${feedback.length > 450 ? "text-yellow-400" : "text-gray-500"}`}>
                  {feedback.length}/500
                </p>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <span className="text-blue-400">⭐</span>
                Rating <span className="text-red-400">*</span>
              </label>
              <StarRating rating={rating} setRating={setRating} />
              {errors.rating && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.rating}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-6 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Review ✨"
              )}
            </button>
          </div>
        </div>
<<<<<<< HEAD
=======
      )}

      {errors.submit && (
        <div aria-live="polite" className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 box-border transition-all"
          />
          {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-invalid={!!errors.role}
            aria-describedby={errors.role ? "role-error" : undefined}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 box-border transition-all"
          />
          {errors.role && <p id="role-error" className="text-red-500 text-xs mt-1.5">{errors.role}</p>}
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-2">
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
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 box-border resize-none transition-all"
          />
          <p className="text-xs text-slate-400 text-right mt-1.5">{feedback.length}/500</p>
          {errors.feedback && <p id="feedback-error" className="text-red-500 text-xs mt-1.5">{errors.feedback}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <StarRating rating={rating} setRating={setRating} />
          {errors.rating && <p className="text-red-500 text-xs mt-1.5">{errors.rating}</p>}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 mt-2"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
>>>>>>> 12f5312 (#1358 fix: improve ReviewForm spacing and responsiveness)
      </div>
    </div>
  );
};

export default ReviewForm;