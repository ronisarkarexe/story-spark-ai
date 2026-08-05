import { Model, Types } from "mongoose";

export interface IFollow {
  follower: Types.ObjectId;
  following: Types.ObjectId;
}

export type FollowModel = Model<IFollow, object>;
