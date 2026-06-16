import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Story } from "../../types/story.types";

interface StoryVersion {
  id: string;
  title: string;
  chapterCount: number;
  timestamp: string;
}

interface StoryState {
  currentStory: Story | null;
  versions: StoryVersion[];
}

const loadStoryFromStorage = (): Story | null => {
  try {
    const raw = localStorage.getItem("story");
    if (!raw) return null;
    return JSON.parse(raw) as Story;
  } catch {
    return null;
  }
};

const initialState: StoryState = {
  currentStory: loadStoryFromStorage(),
  versions: [],
}; 

const storySlice = createSlice({
  name: "story",
  initialState,

  reducers: {
    setStory(state, action: PayloadAction<Story>) {
      state.currentStory = action.payload;

      try {
        const userId = action.payload.userId || "guest";
        const storageKey = `story_${userId}`;
        
        const safeData = {
          version: "1.0",
          data: action.payload
        };
        
        localStorage.setItem(storageKey, JSON.stringify(safeData));
      } catch (error: unknown) {
        const err = error as Error;
        if (err.name === "QuotaExceededError") {
          console.error("Storage limit reached. Cannot save story locally.");
        } else {
          console.error("Error saving story to storage", err);
        }
      }
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

      try {
        const userId = state.currentStory.userId || "guest";
        const storageKey = `story_${userId}`;
        
        const safeData = {
          version: "1.0",
          data: state.currentStory
        };
        
        localStorage.setItem(storageKey, JSON.stringify(safeData));
      } catch (error: unknown) {
        const err = error as Error;
        if (err.name === "QuotaExceededError") {
          console.error("Storage limit reached. Cannot save story locally.");
        } else {
          console.error("Error saving story to storage", err);
        }
      }
    },

    restoreVersion(state, action: PayloadAction<string>) {
      // Stub for compilation
      console.log("Restoring version", state.versions, action.payload);
    },

    deleteVersion(state, action: PayloadAction<string>) {
      // Stub for compilation
      console.log("Deleting version", state.versions, action.payload);
    },
  },
});

export const { setStory, addChapter, restoreVersion, deleteVersion } = storySlice.actions;

export default storySlice.reducer;
