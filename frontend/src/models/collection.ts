export interface CollectionStory {
  _id: string;
  title: string;
  imageURL: string;
  tag: string;
  author: { _id: string; name: string };
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface Collection {
  _id: string;
  ownerId: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  visibility: "public" | "private";
  storyIds: CollectionStory[];
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}
