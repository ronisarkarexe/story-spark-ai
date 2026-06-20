/* eslint-disable */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { RootState } from "../../redux/store";
import { continueStory } from "../../services/continuation.service";
import { addChapter } from "../../redux/slices/storySlice";

const ContinueStoryButton = () => {
  const dispatch = useDispatch();

  const currentStory = useSelector(
    (state: RootState) => state.story.currentStory
  );

  const [loading, setLoading] = useState(false);
  const [useStoryBible, setUseStoryBible] = useState(true);

  const handleContinue = async () => {
    if (!currentStory) return;

    try {
      setLoading(true);

      const nextChapter = await continueStory(
        currentStory.chapters,
        currentStory.id,
        useStoryBible
      );

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="useStoryBible"
          checked={useStoryBible}
          onChange={(e) => setUseStoryBible(e.target.checked)}
          className="w-4 h-4 text-purple-600 bg-zinc-800 border-zinc-700 rounded focus:ring-purple-600 focus:ring-2"
        />
        <label htmlFor="useStoryBible" className="text-sm text-slate-300">
          Use Story Bible context (enforces continuity)
        </label>
      </div>
      <button
        onClick={handleContinue}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 transition-all px-6 py-3 rounded-xl text-white font-semibold"
      >
        {loading
          ? "Generating Chapter..."
          : "Continue Story"}
      </button>
    </div>
  );
};

export default ContinueStoryButton;
