import React, { useState } from 'react';
import { useRateStoryMutation } from '../../redux/apis/story_rating.api';
import { toast } from 'react-hot-toast';

interface StoryRatingInputProps {
  storyId: string;
}

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const StoryRatingInput: React.FC<StoryRatingInputProps> = ({ storyId }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [rateStory, { isLoading }] = useRateStoryMutation();

  const renderStarIcon = (index: number) => {
    if (rating >= index) return <i className="fa-solid fa-star" />;
    if (rating >= index - 0.5) return <i className="fa-solid fa-star-half-stroke" />;
    return <i className="fa-regular fa-star" />;
  };

  const handleSubmit = async () => {
    if (rating < 0.5) {
      toast.error("Please select a star rating first.");
      return;
    }
    try {
      await rateStory({ storyId, rating, review }).unwrap();
      toast.success("Thank you! Your rating has been submitted.");
    } catch (error) {
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 backdrop-blur-md shadow-lg transition-all">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Rate this Story</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">What did you think of this piece? Your feedback helps the author grow!</p>
      
      <div className="flex flex-col items-center mb-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className="relative text-3xl text-gray-300 dark:text-slate-600 hover:scale-110 transition-transform cursor-pointer"
              onMouseLeave={() => setHovered(0)}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 ${
                  star <= Math.ceil(hovered || rating) ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" : ""
                }`}
              >
                {renderStarIcon(star)}
              </div>
              <button
                type="button"
                onMouseEnter={() => setHovered(star - 0.5)}
                onClick={() => setRating(star - 0.5)}
                className="absolute left-0 top-0 h-full w-1/2 bg-transparent"
              />
              <button
                type="button"
                onMouseEnter={() => setHovered(star)}
                onClick={() => setRating(star)}
                className="absolute right-0 top-0 h-full w-1/2 bg-transparent"
              />
            </div>
          ))}
        </div>
        {(hovered || rating) > 0 && (
          <p className="text-sm font-semibold tracking-wide text-yellow-500 mt-2">
            {ratingLabels[Math.round(hovered || rating) || 0]}
          </p>
        )}
      </div>

      <div className="mb-4">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Optional: Leave a brief review for the author..."
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
        />
        <p className="text-right text-xs text-slate-400 mt-1">{review.length}/500</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading || rating === 0}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
    </div>
  );
};

export default StoryRatingInput;
