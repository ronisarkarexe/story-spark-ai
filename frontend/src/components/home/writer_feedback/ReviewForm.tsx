import React, { useState, useCallback } from "react";
import { useCreateReviewMutation } from "../../../redux/apis/review.api";

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

type StarRatingProps = {
  rating: number;
  setRating: (n: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`text-2xl transition-all duration-200 hover:scale-125 focus:outline-none ${
              star <= (hovered || rating) ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {(hovered || rating) > 0 && (
        <p className="text-xs font-semibold text-yellow-400">
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

  const handleSubmit = useCallback(async () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!role.trim()) newErrors.role = "Role is required.";
    if (!feedback.trim()) newErrors.feedback = "Review is required.";
    if (rating === 0) newErrors.rating = "Please select a rating.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
    } catch {
      setErrors({ submit: "Failed to submit review. Please try again." });
    }
  }, [createReview, name, role, feedback, rating]);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
        <h3 className="text-2xl font-bold text-white mb-6">Share Your Experience</h3>
        
        {success && (
          <div className="mb-4 p-4 bg-green-900/30 text-green-300 rounded-xl text-sm">
            🎉 Thank you! Your review has been submitted for approval.
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <input
            className="w-full rounded-lg bg-white/5 p-3 text-white border border-white/10 focus:border-blue-500 outline-none"
            placeholder="Your Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}

          <input
            className="w-full rounded-lg bg-white/5 p-3 text-white border border-white/10 focus:border-blue-500 outline-none"
            placeholder="Your Role *"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          {errors.role && <p className="text-xs text-red-400">{errors.role}</p>}

          <textarea
            className="w-full rounded-lg bg-white/5 p-3 text-white border border-white/10 focus:border-blue-500 outline-none h-32"
            placeholder="Tell us about your experience *"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{feedback.length}/500</span>
            {errors.feedback && <span className="text-red-400">{errors.feedback}</span>}
          </div>

          <StarRating rating={rating} setRating={setRating} />
          {errors.rating && <p className="text-xs text-red-400">{errors.rating}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            {isLoading ? "Submitting..." : "Share Review ✨"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;