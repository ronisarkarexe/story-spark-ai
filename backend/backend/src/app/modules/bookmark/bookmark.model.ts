import { Schema, model } from "mongoose";
import { IBookmark } from "./bookmark.interface";

const BookmarkSchema = new Schema<IBookmark>(
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
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// Add compound unique index to prevent duplicates at the database level
BookmarkSchema.index({ userId: 1, storyId: 1 }, { unique: true });

export const Bookmark = model<IBookmark>("Bookmark", BookmarkSchema);
