import { Model, Types } from "mongoose";

export type CollectionVisibility = "public" | "private";

export interface ICollection {
  _id?: Types.ObjectId;
  ownerId: Types.ObjectId;
  title: string;
  description?: string;
  coverImageUrl?: string;
  visibility: CollectionVisibility;
  /** Ordered array of Post ObjectIds */
  storyIds: Types.ObjectId[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CollectionModel = Model<ICollection, object>;
