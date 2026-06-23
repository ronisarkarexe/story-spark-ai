import { model, Schema } from "mongoose";
import { IStoryVersion, StoryVersionModel } from "./story_version.interface";

export const StoryVersionSchema = new Schema<IStoryVersion, StoryVersionModel>(
  {
    storyId: {type: Schema.Types.ObjectId, ref: "Post", required: true,},
    content: {type: String, required: true,},
    title: {type: String, required: true,},
    prompt: {type: String, default: "",},
    generationType: {type: String, required: true,},
    versionNumber: {type: Number, required: true,},
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true,},

    //Branching Metadata
    parentVersionId: {type: Schema.Types.ObjectId, ref: "StoryVersion", default: null,},
    branchName: {type: String, default: null, trim: true,},
    branchDepth: {type: Number, default: 0, min: 0,},
  },
  {
    timestamps: true,
  }
);

//Existing timeline ordering index. Must remain same
StoryVersionSchema.index(
  { storyId: 1, versionNumber: -1 },
  { unique: true }
);

//Optimizes branch traversal
StoryVersionSchema.index({storyId: 1, parentVersionId: 1,});

//Optimizes tree rendering queries
StoryVersionSchema.index({storyId: 1, branchDepth: 1,});

export const StoryVersion = model<IStoryVersion, StoryVersionModel>("StoryVersion", StoryVersionSchema);