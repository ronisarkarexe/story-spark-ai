import { Schema, model } from "mongoose";
import { ICollabRoom } from "./collab.interface";

const ParticipantSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  color: { type: String, required: true },
  socketId: { type: String, required: true },
});

const StoryChunkSchema = new Schema({
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  color: { type: String, required: true },
  text: { type: String, required: true },
  isAI: { type: Boolean, required: true, default: false },
  timestamp: { type: Date, default: Date.now },
});

const CollabRoomSchema = new Schema<ICollabRoom>(
  {
    roomId: { type: String, required: true, unique: true },
    createdBy: { type: String, required: true },
    participants: { type: [ParticipantSchema], default: [] },
    story: { type: [StoryChunkSchema], default: [] },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Enable dynamic TTL expiration based on expiresAt field
CollabRoomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const CollabRoom = model<ICollabRoom>("CollabRoom", CollabRoomSchema);
