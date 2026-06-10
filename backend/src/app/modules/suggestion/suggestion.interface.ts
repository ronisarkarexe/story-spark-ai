import { Model, Types } from "mongoose";

export type SuggestionType =
  | "plot"
  | "character"
  | "dialogue"
  | "scene"
  | "structure"
  | "tone"
  | "conflict";

export interface ISuggestion {
  userId: Types.ObjectId;
  storyId?: Types.ObjectId;
  suggestionType: SuggestionType;
  originalText?: string;
  storyContext: string;
  generatedSuggestion: any;
  accepted: boolean;
  rejected: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SuggestionModel = Model<ISuggestion, object>;
