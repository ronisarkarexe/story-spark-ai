import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Story, StoryVersion } from "../../types/story.types";

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
    restoreVersion(state, action: PayloadAction<string>) {
      const versionId = action.payload;
      const found = state.versions.find(v => v.id === versionId);
      if (found) {
        state.currentStory = found.storySnapshot;
      }
    },
    deleteVersion(state, action: PayloadAction<string>) {
      state.versions = state.versions.filter(v => v.id !== action.payload);
    },
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
      } catch (error: any) {
        if (error.name === "QuotaExceededError") {
          console.error("Storage limit reached. Cannot save story locally.");
        } else {
          console.error("Error saving story to storage", error);
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
      } catch (error: any) {
        if (error.name === "QuotaExceededError") {
          console.error("Storage limit reached. Cannot save story locally.");
        } else {
          console.error("Error saving story to storage", error);
        }
      }
    },
  },
});

export const { restoreVersion, deleteVersion, setStory, addChapter } = storySlice.actions;

export default storySlice.reducer;
