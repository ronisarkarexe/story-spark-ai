export interface Topic {
  title: string;
  color: string;
  selected: boolean;
  _id: string;
}

interface Author {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
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
  userId: { email: string } | string | any;
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
  author: Author;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isPublished: boolean;
  isFeaturedPost: boolean;
  publishedAt: string;
  updatedBy: string;
  attachments: string[];
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}
