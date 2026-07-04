export interface IChatMessage {
  senderId: string;
  senderName: string;
  senderColor: string;
  content: string;
  type: "message" | "system";
  timestamp: Date;
}

export interface ICollabRoom {
  roomId: string;
  createdBy: string;
  participants: IParticipant[];
  story: IStoryChunk[];
  chatMessages: IChatMessage[];
  createdAt: Date;
  expiresAt: Date;
  collabState?: Buffer;
  isAiGenerating: boolean;
  isPublic: boolean;
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