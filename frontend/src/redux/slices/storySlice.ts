import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Story, Chapter, StoryVersion } from "../../types/story.types";

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
    const raw = localStorage.getItem("story_versions");
    if (!raw) return [];
    return JSON.parse(raw) as StoryVersion[];
  } catch {
    return [];
  }
};

const saveVersionsToStorage = (versions: StoryVersion[]) => {
  try {
    localStorage.setItem("story_versions", JSON.stringify(versions));
  } catch (error) {
    console.error("Error saving versions to storage", error);
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

      // Save current version to history
      if (action.payload.chapters.length > 0) {
        const newVersion: StoryVersion = {
          id: Date.now().toString(),
          title: action.payload.title,
          chapterCount: action.payload.chapters.length,
          timestamp: new Date().toISOString(),
          storySnapshot: JSON.parse(JSON.stringify(action.payload)),
        };
        
        // Add to versions (avoid duplicates)
        const existingIndex = state.versions.findIndex(
          (v) => v.chapterCount === newVersion.chapterCount
        );
        
        if (existingIndex === -1) {
          state.versions.unshift(newVersion);
          // Keep only last 20 versions
          if (state.versions.length > 20) {
            state.versions = state.versions.slice(0, 20);
          }
          saveVersionsToStorage(state.versions);
        }
      }

      try {
        const storageKey = `story_current`;
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

      const nextChapter: Chapter = {
        id: state.currentStory.chapters.length + 1,
        title: `Chapter ${state.currentStory.chapters.length + 1}`,
        content: action.payload,
        createdAt: new Date().toISOString(),
      };

      state.currentStory.chapters.push(nextChapter);

      // Save new version
      const newVersion: StoryVersion = {
        id: Date.now().toString(),
        title: state.currentStory.title,
        chapterCount: state.currentStory.chapters.length,
        timestamp: new Date().toISOString(),
        storySnapshot: JSON.parse(JSON.stringify(state.currentStory)),
      };
      
      state.versions.unshift(newVersion);
      if (state.versions.length > 20) {
        state.versions = state.versions.slice(0, 20);
      }
      saveVersionsToStorage(state.versions);

      try {
        const storageKey = `story_current`;
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

    // Restore a specific version
    restoreVersion(state, action: PayloadAction<string>) {
      const version = state.versions.find(v => v.id === action.payload);
      if (version && version.storySnapshot) {
        // Restore the story from the version snapshot
        state.currentStory = JSON.parse(JSON.stringify(version.storySnapshot));
        
        // Save to localStorage
        try {
          const storageKey = `story_current`;
          const safeData = {
            version: "1.0",
            data: state.currentStory
          };
          localStorage.setItem(storageKey, JSON.stringify(safeData));
        } catch (error) {
          console.error("Error saving restored story", error);
        }
      }
    },

    // Delete a specific version
    deleteVersion(state, action: PayloadAction<string>) {
      state.versions = state.versions.filter(v => v.id !== action.payload);
      saveVersionsToStorage(state.versions);
    },

    // Clear all versions
    clearVersions(state) {
      state.versions = [];
      saveVersionsToStorage([]);
    },

    // Update story title
    updateStoryTitle(state, action: PayloadAction<string>) {
      if (state.currentStory) {
        state.currentStory.title = action.payload;
        
        // Update localStorage
        try {
          const storageKey = `story_current`;
          const safeData = {
            version: "1.0",
            data: state.currentStory
          };
          localStorage.setItem(storageKey, JSON.stringify(safeData));
        } catch (error) {
          console.error("Error saving updated title", error);
        }
      }
    },
  },
});

export const { 
  setStory, 
  addChapter, 
  restoreVersion, 
  deleteVersion, 
  clearVersions,
  updateStoryTitle 
} = storySlice.actions;

export default storySlice.reducer;