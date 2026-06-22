import { Model, Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  parentCommentId?: Types.ObjectId;
  likes?: Types.ObjectId[];
  helpful?: Types.ObjectId[];
  isDeleted?: boolean;
  deletedAt?: Date | null;

  isHidden?: boolean;
}

export type CommentModel = Model<IComment, object>;

export interface ICommentPayload {
  postId: string;
  comment: string;
  parentCommentId?: string;
}

export interface IPopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface ILeanComment {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  userId: IPopulatedUser;
  comment: string;
  parentCommentId?: Types.ObjectId;
  likes?: any[];
  helpful?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDTO extends ILeanComment {
  replies: ICommentDTO[];
}
