import { Model, Types } from "mongoose";

export interface IStoryRating {
  storyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number; // 1 to 5
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StoryRatingModel = Model<IStoryRating, Record<string, unknown>>;
