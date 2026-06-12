import { model, Schema } from "mongoose";
import {
  IUniverse,
  IUniverseMemory,
  UniverseModel,
  UniverseMemoryModel,
} from "./universe.interface";

export const UniverseSchema = new Schema<IUniverse, UniverseModel>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stories: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

UniverseSchema.index({ author: 1 });
UniverseSchema.index({ stories: 1 });

export const Universe = model<IUniverse, UniverseModel>("Universe", UniverseSchema);

export const UniverseMemorySchema = new Schema<IUniverseMemory, UniverseMemoryModel>(
  {
    universeId: { type: Schema.Types.ObjectId, ref: "Universe", required: true },
    type: {
      type: String,
      enum: [
        "character",
        "relationship",
        "location",
        "event",
        "rule",
        "magic_system",
        "object",
        "other",
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 10000 },
    attributes: { type: Schema.Types.Mixed, default: {} },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UniverseMemorySchema.index({ universeId: 1, type: 1 });
UniverseMemorySchema.index({ isDeleted: 1 });
// Compound index for text searching
UniverseMemorySchema.index({ title: "text", content: "text" });

export const UniverseMemory = model<IUniverseMemory, UniverseMemoryModel>(
  "UniverseMemory",
  UniverseMemorySchema
);
