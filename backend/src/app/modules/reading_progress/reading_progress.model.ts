import { Schema, model } from "mongoose";
import { IReadingProgress } from "./reading_progress.interface";

const ReadingProgressSchema = new Schema<IReadingProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    lastScrollPosition: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicates at the database level
ReadingProgressSchema.index({ userId: 1, storyId: 1 }, { unique: true });
// Index on updatedAt to sort by recently viewed
ReadingProgressSchema.index({ userId: 1, updatedAt: -1 });

export const ReadingProgress = model<IReadingProgress>("ReadingProgress", ReadingProgressSchema);
