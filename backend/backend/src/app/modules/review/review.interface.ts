import { Model, Types } from "mongoose";

export interface IReview {
  userId?: Types.ObjectId;
  name: string;
  role: string;
  feedback: string;
  imgSrc?: string;
  rating?: number;
  isPublished: boolean;
  sortOrder?: number;
}

export type ReviewModel = Model<IReview, object>;

export interface IReviewPayload {
  name: string;
  role: string;
  feedback: string;
  imgSrc?: string;
  rating?: number;
}
