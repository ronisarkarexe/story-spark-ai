import { Schema, model } from "mongoose";
import { ISuggestion, SuggestionModel } from "./suggestion.interface";

const SuggestionSchema = new Schema<ISuggestion, SuggestionModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    storyId: { type: Schema.Types.ObjectId, ref: "Post", required: false },
    suggestionType: {
      type: String,
      enum: ["plot", "character", "dialogue", "scene", "structure", "tone", "conflict"],
      required: true,
    },
    originalText: { type: String, default: "" },
    storyContext: { type: String, required: true },
    generatedSuggestion: { type: Schema.Types.Mixed, required: true },
    accepted: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
SuggestionSchema.index({ userId: 1, createdAt: -1 });
SuggestionSchema.index({ storyId: 1 });
SuggestionSchema.index({ userId: 1, accepted: 1 });

export const Suggestion = model<ISuggestion, SuggestionModel>("Suggestion", SuggestionSchema);
