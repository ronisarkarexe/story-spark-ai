/* eslint-disable */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { RootState } from "../../redux/store";
import { continueStory } from "../../services/continuation.service";
import { addChapter } from "../../redux/slices/storySlice";

const TONE_OPTIONS = [
  "Default",
  "Horror",
  "Emotional",
  "Funny",
  "Cinematic",
  "Romantic",
  "Dark Fantasy",
  "Motivational",
];

const ContinueStoryButton = () => {
  const dispatch = useDispatch();

  const currentStory = useSelector(
    (state: RootState) => state.story.currentStory
  );

  const [loading, setLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string>("Default");

  const handleContinue = async () => {
    if (!currentStory) return;

    try {
      setLoading(true);

      const nextChapter = await continueStory(currentStory.chapters);

      dispatch(addChapter(nextChapter));
      toast.success("New chapter generated successfully!");
    } catch (error: any) {
      console.error(error);
      const errorMsg = error?.message || "Failed to continue story. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const buttonText =
    selectedTone === "Default"
      ? "Continue Story"
      : `Continue Story in ${selectedTone} tone`;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="flex flex-col gap-2 w-full sm:w-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Tone
        </span>
        <select
          id="continue-story-tone"
          value={selectedTone}
          onChange={(event) => setSelectedTone(event.target.value)}
          className="w-full sm:w-56 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 outline-none transition-all focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/20"
        >
          {TONE_OPTIONS.map((tone) => (
            <option key={tone} value={tone} className="bg-slate-900 text-slate-100">
              {tone}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 transition-all px-6 py-3 rounded-xl text-white font-semibold"
      >
        {loading ? "Generating Chapter..." : buttonText}
      </button>
    </div>
  );
};

export default ContinueStoryButton;
