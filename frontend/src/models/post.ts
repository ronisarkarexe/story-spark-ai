export interface Topic {
  title: string;
  color: string;
  selected: boolean;
  _id: string;
}

interface Author {
  _id: string;
  email?: string;
  name: string;
  createdAt: string;
  profile?: {
    bio?: string;
  };
}

interface Comment {
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  _id: string;
}

interface Reaction {
  postId: string;
  userId: { _id: string } | string;
  type: "like" | "love" | "laugh" | "angry" | "sad";
  _id: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  topic: Topic[];
  language?: string;
  emotions?: string[];
  genre?: string;
  author: Author;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  viewsCount: number;
  averageRating: number;
  totalRatings: number;
  isPublished: boolean;
  isFeaturedPost: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  publishedAt: string;
  updatedBy: string;
  attachments: string[];
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}
