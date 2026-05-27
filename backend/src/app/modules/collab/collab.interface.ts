export interface ICollabRoom {
  roomId: string;
  createdBy: string;
  participants: IParticipant[];
  story: IStoryChunk[];
  createdAt: Date;
  expiresAt: Date;
}

export interface IParticipant {
  userId: string;
  username: string;
  color: string;
  socketId: string;
}

export interface IStoryChunk {
  authorId: string;
  authorName: string;
  color: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}