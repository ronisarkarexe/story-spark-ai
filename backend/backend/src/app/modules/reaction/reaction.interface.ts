import { Model, Types } from "mongoose";

export interface IReaction {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  type: "like" | "love" | "laugh" | "angry" | "sad";
}

export type ReactionModel = Model<IReaction, object>;
