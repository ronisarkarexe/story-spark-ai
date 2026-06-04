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
      await createReview({ name, role, feedback, rating, imgSrc: "" });
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
    <div className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a]/90 to-[#111827]/90 p-6 sm:p-10 shadow-2xl shadow-blue-500/10 backdrop-blur-md">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
              ✍️ Share Your Story
            </div>
            <h3 className="text-2xl font-bold text-white">Share Your Experience</h3>
            <p className="mt-1 text-sm text-gray-400">Your feedback helps us improve StorySparkAI for everyone.</p>
          </div>

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
              <span>🎉 Thank you! Your review has been submitted for approval.</span>
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <span>⚠️ {errors.submit}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-blue-400">👤</span> Name <span className="text-red-400">*</span>
              </label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full max-w-lg rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="role" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-blue-400">💼</span> Role <span className="text-red-400">*</span>
              </label>
              <input id="role" type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Fantasy Writer" className="w-full max-w-lg rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              {errors.role && <p className="mt-1.5 text-xs text-red-400">{errors.role}</p>}
            </div>

            <div>
              <label htmlFor="feedback" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-blue-400">💬</span> Review <span className="text-red-400">*</span>
              </label>
              <textarea id="feedback" rows={4} maxLength={500} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell us about your experience..." className="w-full max-w-lg resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{errors.feedback || ""}</span>
                <span>{feedback.length}/500</span>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-blue-400">⭐</span> Rating <span className="text-red-400">*</span>
              </label>
              <StarRating rating={rating} setRating={setRating} />
              {errors.rating && <p className="mt-1.5 text-xs text-red-400">{errors.rating}</p>}
            </div>

            <button type="button" onClick={handleSubmit} disabled={isLoading} className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
              {isLoading ? "Submitting..." : "Share Review ✨"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;