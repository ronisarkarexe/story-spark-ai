import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
    } catch (error) {
      console.error(error);
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