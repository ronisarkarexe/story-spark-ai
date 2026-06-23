import { Types } from "mongoose";

export interface IReadingProgress {
  userId: Types.ObjectId;
  storyId: Types.ObjectId;
  progress: number; // 0 to 100 percentage
  lastScrollPosition?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
