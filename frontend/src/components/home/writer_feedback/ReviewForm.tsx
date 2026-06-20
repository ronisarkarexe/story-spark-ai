import React, { useState } from "react";
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

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (n: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);

  const renderStarIcon = (index: number) => {
    // index is 1..5
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
    if (rating < 0.5) newErrors.rating = "Please select a rating";

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
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
