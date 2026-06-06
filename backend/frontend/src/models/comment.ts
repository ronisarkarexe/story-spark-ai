interface User {
  _id: string;
  email: string;
  name: string;
}

interface Comment {
  _id: string;
  postId: string;
  userId: User;
  comment: string;
  parentCommentId: string | null;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}

export interface CommentResponse {
  comments: Comment[];
  totalComments: number;
}
