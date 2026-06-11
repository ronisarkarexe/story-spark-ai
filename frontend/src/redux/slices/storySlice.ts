import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Story,
  StoryVersion,
} from "../../types/story.types";

interface StoryState {
  currentStory: Story | null;
  versions: StoryVersion[];
}

const initialState: StoryState = {
  currentStory: null,
  versions:
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("storyVersions") || "[]"
        )
      : [],
};

const storySlice = createSlice({
  name: "story",
  initialState,

  reducers: {
    setStory(
      state,
      action: PayloadAction<Story>
    ) {
      state.currentStory = action.payload;

      localStorage.setItem(
        "story",
        JSON.stringify(action.payload)
      );
    },

    addChapter(
      state,
      action: PayloadAction<string>
    ) {
      if (!state.currentStory) return;

      // Save current story version before adding chapter
      const version: StoryVersion = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        title: state.currentStory.title,
        chapterCount:
          state.currentStory.chapters.length,
        storySnapshot: JSON.parse(
          JSON.stringify(state.currentStory)
        ),
      };

      state.versions.push(version);

      localStorage.setItem(
        "storyVersions",
        JSON.stringify(state.versions)
      );

      const nextChapter = {
        id:
          state.currentStory.chapters.length + 1,
        title: `Chapter ${
          state.currentStory.chapters.length + 1
        }`,
        content: action.payload,
        createdAt: new Date().toISOString(),
      };

      state.currentStory.chapters.push(
        nextChapter
      );

      localStorage.setItem(
        "story",
        JSON.stringify(state.currentStory)
      );
    },

    restoreVersion(
      state,
      action: PayloadAction<string>
    ) {
      const version = state.versions.find(
        (v) => v.id === action.payload
      );

      if (!version) return;

      state.currentStory = JSON.parse(
        JSON.stringify(version.storySnapshot)
      );

      localStorage.setItem(
        "story",
        JSON.stringify(state.currentStory)
      );
    },

    deleteVersion(
      state,
      action: PayloadAction<string>
    ) {
      state.versions = state.versions.filter(
        (v) => v.id !== action.payload
      );

      localStorage.setItem(
        "storyVersions",
        JSON.stringify(state.versions)
      );
    },
  },
});

export const {
  setStory,
  addChapter,
  restoreVersion,
  deleteVersion,
} = storySlice.actions;

export default storySlice.reducer;