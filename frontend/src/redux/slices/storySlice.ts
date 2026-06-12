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

const loadVersionsFromStorage = (): StoryVersion[] => {
  try {
    return JSON.parse(localStorage.getItem("storyVersions") || "[]");
  } catch {
    return [];
  }
};

const initialState: StoryState = {
  currentStory: loadStoryFromStorage(),
  versions: loadVersionsFromStorage(),
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
        localStorage.setItem("story", JSON.stringify(action.payload));
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

      // Save current story version before adding chapter
      const version: StoryVersion = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        title: state.currentStory.title,
        chapterCount: state.currentStory.chapters.length,
        storySnapshot: JSON.parse(JSON.stringify(state.currentStory)),
      };

      state.versions.push(version);

      try {
        localStorage.setItem("storyVersions", JSON.stringify(state.versions));
      } catch (error: any) {
        console.error("Error saving story versions to storage", error);
      }

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
        localStorage.setItem("story", JSON.stringify(state.currentStory));
      } catch (error: any) {
        if (error.name === "QuotaExceededError") {
          console.error("Storage limit reached. Cannot save story locally.");
        } else {
          console.error("Error saving story to storage", error);
        }
      }
    },

    restoreVersion(state, action: PayloadAction<string>) {
      const version = state.versions.find((v) => v.id === action.payload);
      if (!version) return;

      state.currentStory = JSON.parse(JSON.stringify(version.storySnapshot));

      try {
        const userId = state.currentStory?.userId || "guest";
        const storageKey = `story_${userId}`;
        
        const safeData = {
          version: "1.0",
          data: state.currentStory
        };
        
        localStorage.setItem(storageKey, JSON.stringify(safeData));
        localStorage.setItem("story", JSON.stringify(state.currentStory));
      } catch (error: any) {
        console.error("Error saving restored story to storage", error);
      }
    },

    deleteVersion(state, action: PayloadAction<string>) {
      state.versions = state.versions.filter((v) => v.id !== action.payload);

      try {
        localStorage.setItem("storyVersions", JSON.stringify(state.versions));
      } catch (error: any) {
        console.error("Error saving versions after deletion to storage", error);
      }
    },
  },
});

export const { setStory, addChapter, restoreVersion, deleteVersion } = storySlice.actions;

export default storySlice.reducer;
