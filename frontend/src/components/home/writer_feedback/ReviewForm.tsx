import React, { useState } from "react";
import { useCreateReviewMutation } from "../../../redux/apis/review.api";

const ReviewForm = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async () => {
    if (!name || !role || !feedback || rating === 0) return;
    await createReview({ name, role, feedback, rating, imgSrc: "" });
    setName("");
    setRole("");
    setFeedback("");
    setRating(0);
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-700 bg-slate-950 p-6 text-slate-100 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Share Your Review</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Review</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white"
          >
            <option value={0}>Select rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
