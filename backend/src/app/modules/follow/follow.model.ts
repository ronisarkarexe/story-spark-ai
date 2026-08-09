import { Schema, model } from "mongoose";
import { IFollow, FollowModel } from "./follow.interface";

const FollowSchema = new Schema<IFollow, FollowModel>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

FollowSchema.index(
  { follower: 1, following: 1 },
  { unique: true }
);

export const Follow = model<IFollow, FollowModel>(
  "Follow",
  FollowSchema
);
