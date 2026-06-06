import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Story } from "../../types/story.types";

interface StoryState {
  currentStory: Story | null;
}

const initialState: StoryState = {
  currentStory: null,
};

const storySlice = createSlice({
  name: "story",
  initialState,

  reducers: {
    setStory(state, action: PayloadAction<Story>) {
      state.currentStory = action.payload;

      localStorage.setItem(
        "story",
        JSON.stringify(action.payload)
      );
    },

    addChapter(state, action: PayloadAction<string>) {
      if (!state.currentStory) return;

      const nextChapter = {
        id: state.currentStory.chapters.length + 1,
        title: `Chapter ${state.currentStory.chapters.length + 1}`,
        content: action.payload,
        createdAt: new Date().toISOString(),
      };

      state.currentStory.chapters.push(nextChapter);

      localStorage.setItem(
        "story",
        JSON.stringify(state.currentStory)
      );
    },
  },
});

export const { setStory, addChapter } =
  storySlice.actions;

export default storySlice.reducer;