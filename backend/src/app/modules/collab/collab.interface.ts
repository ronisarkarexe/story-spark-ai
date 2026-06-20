export interface ICollabRoom {
  roomId: string;
  createdBy: string;
  participants: IParticipant[];
  story: IStoryChunk[];
  createdAt: Date;
  expiresAt: Date;
  collabState?: Buffer;
  isAiGenerating: boolean;
  whitelist: string[];
  invitedUsers: string[];
  guestsReadOnly: boolean;
  password?: string;
}

export interface IParticipant {
  userId: string;
  username: string;
  color: string;
  socketId: string;
  isReadOnly: boolean;
}

export interface IStoryChunk {
  authorId: string;
  authorName: string;
  color: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}
