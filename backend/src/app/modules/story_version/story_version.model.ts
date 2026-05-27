import { model, Schema } from "mongoose";
import { IStoryVersion, StoryVersionModel } from "./story_version.interface";

export const StoryVersionSchema = new Schema<IStoryVersion, StoryVersionModel>(
  {
    storyId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    title: { type: String, required: true },
    prompt: { type: String, default: "" },
    generationType: { type: String, required: true },
    versionNumber: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique constraints and optimized chronological order retrievals
StoryVersionSchema.index({ storyId: 1, versionNumber: -1 }, { unique: true });

export const StoryVersion = model<IStoryVersion, StoryVersionModel>(
  "StoryVersion",
  StoryVersionSchema
);
