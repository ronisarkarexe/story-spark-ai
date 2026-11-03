import { Schema, model } from "mongoose";
import { IImageCache } from "./chapter_illustration.interface";

const imageCacheSchema = new Schema<IImageCache>(
  {
    cacheKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ["openai", "stability", "replicate", "huggingface"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index for automatic deletion
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ImageCacheModel = model<IImageCache>(
  "ImageCache",
  imageCacheSchema
);
