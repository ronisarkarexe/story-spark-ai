import { model, Schema } from "mongoose";
import { CollectionModel, ICollection } from "./collection.interface";

const CollectionSchema: Schema<ICollection> = new Schema<ICollection, CollectionModel>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: 200, trim: true },
    description: { type: String, maxlength: 2000, trim: true },
    coverImageUrl: { type: String, maxlength: 2000 },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    /** Ordered array — position in array determines display order */
    storyIds: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CollectionSchema.index({ ownerId: 1, createdAt: -1 });
CollectionSchema.index({ visibility: 1, isDeleted: 1 });

export const Collection = model<ICollection, CollectionModel>(
  "Collection",
  CollectionSchema
);
