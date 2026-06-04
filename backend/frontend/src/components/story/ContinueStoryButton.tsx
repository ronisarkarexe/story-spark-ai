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

  const handleContinue = async () => {
    if (!currentStory) return;

    try {
      setLoading(true);

      const nextChapter = await continueStory(
        currentStory.chapters
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
    <button
      onClick={handleContinue}
      disabled={loading}
      className="bg-purple-600 hover:bg-purple-700 transition-all px-6 py-3 rounded-xl text-white font-semibold"
    >
      {loading
        ? "Generating Chapter..."
        : "Continue Story"}
    </button>
  );
};

export default ContinueStoryButton;