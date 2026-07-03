export interface IStoryRating {
  _id: string;
  storyId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRatingResponse {
  averageRating: number;
  totalRatings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface IRateStoryPayload {
  storyId: string;
  rating: number;
  review?: string;
}
