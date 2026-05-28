import { Model, Types } from "mongoose";

interface ITopic {
  title: string;
  color: string;
  selected: boolean;
}

export interface IPostPayload {
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  topic: ITopic[];
  language?: string;
  isPublished?: boolean;
}

export interface IPost extends IPostPayload {
  author: Types.ObjectId;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isPublished: boolean;
  isFeaturedPost?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
  publishedAt?: Date;
  updatedBy?: Types.ObjectId;
  attachments?: string[];
  comments?: Types.ObjectId[];
  reactions?: Types.ObjectId[];
  bookmarks?: Types.ObjectId[];
}

export type PostModel = Model<IPost, object>;

export interface IPostSearchFields {
  searchTerm?: string;
  title?: string;
  tag?: string;
  trendingTopic?: string;
  sortFilter?: "mostPopular";
  genres?: string | string[];
}
