import { model, Schema } from "mongoose";
import { IStoryRating, StoryRatingModel } from "./story_rating.interface";

const StoryRatingSchema = new Schema<IStoryRating, StoryRatingModel>(
  {
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate ratings for the same story by the same user
StoryRatingSchema.index({ storyId: 1, userId: 1 }, { unique: true });

// Optimize querying ratings for a story
StoryRatingSchema.index({ storyId: 1, rating: -1 });

export const StoryRating = model<IStoryRating, StoryRatingModel>(
  "StoryRating",
  StoryRatingSchema
);
