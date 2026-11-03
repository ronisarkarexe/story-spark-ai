// backend/src/models/storyCache.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IStoryCache extends Document {
  promptKey: string;
  provider: string;
  storyData: string;
  createdAt: Date;
}

const StoryCacheSchema: Schema = new Schema(
  {
    promptKey: { 
      type: String, 
      required: true, 
      unique: true, // Prevents duplicate cache insertions
      index: true   // Speeds up lookups on repeated views
    },
    provider: { 
      type: String, 
      required: true 
    },
    storyData: { 
      type: String, 
      required: true 
    }
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

export const StoryCache = mongoose.model<IStoryCache>("StoryCache", StoryCacheSchema);