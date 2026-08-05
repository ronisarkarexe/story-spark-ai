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
  emotions?: string[];
  genre?: string;
  isPublished?: boolean;
}

export interface IPost extends IPostPayload {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  bookmarksCount: number;
  averageRating: number;
  totalRatings: number;
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
  parentStoryId?: Types.ObjectId;
  rootStoryId?: Types.ObjectId;
}

export interface IEngagementStats {
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  viewsCount: number;
  averageRating: number;
  totalRatings: number;
}

export type PostModel = Model<IPost, object> & {
  getEngagementStats(
    postId: string | Types.ObjectId
  ): Promise<IEngagementStats | null>;
};

export interface IPostSearchFields {
  searchTerm?: string;
  title?: string;
  tag?: string;
  trendingTopic?: string;
  sortFilter?: "mostPopular";
  genres?: string | string[];
}
