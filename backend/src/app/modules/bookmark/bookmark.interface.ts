import { Types } from "mongoose";

export interface IBookmark {
  userId: Types.ObjectId;
  storyId: Types.ObjectId;
  createdAt?: Date;
}
