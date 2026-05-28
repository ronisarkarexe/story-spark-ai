import { Server, Socket } from "socket.io";
import { Secret } from "jsonwebtoken";
import logger from "../utils/logger.util";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config";
import { JwtHalers } from "../utils/jwt.helper";

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"
];

interface IParticipant {
  userId: string;
  username: string;
  color: string;
  socketId: string;
}

interface IStoryChunk {
  authorId: string;
  authorName: string;
  color: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface IRoom {
  roomId: string;
  createdBy: string;
  participants: IParticipant[];
  story: IStoryChunk[];
  createdAt: Date;
}

const rooms = new Map<string, IRoom>();

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function getColorForUser(index: number): string {
  return COLORS[index % COLORS.length];
}

export const setupCollabSocket = (io: Server) => {
  const collabNamespace = io.of("/collab");

  // Authenticate every connection to the /collab namespace using the same
  // JWT pattern applied to the main io namespace in server.ts. Without this,
  // any anonymous client could create rooms, join rooms, and impersonate
  // other users by simply supplying an arbitrary userId in the payload.
  collabNamespace.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const verifiedUser = JwtHalers.verifyToken(
        token,
        config.jwt.secret as Secret
      );
      const userId =
        verifiedUser._id ||
        verifiedUser.userId ||
        verifiedUser.sub ||
        verifiedUser.id;
      if (!userId) {
        return next(new Error("Unauthorized"));
      }

      socket.data.userId = userId.toString();
      socket.data.username =
        (verifiedUser.name as string | undefined) ||
        (verifiedUser.username as string | undefined);
      next();
    } catch (error) {
      logger.warn("Collab socket auth failed", error);
      next(new Error("Unauthorized"));
    }
  });

  collabNamespace.on("connection", (socket: Socket) => {
    logger.debug("Collab socket connected");

    const authUserId = socket.data.userId as string;
    const authUsername = (socket.data.username as string | undefined) || "User";

    // Create a new room
    socket.on("collab:create_room", (payload: { username?: string } = {}) => {
      const username = payload.username || authUsername;
      const roomId = generateRoomId();
      const room: IRoom = {
        roomId,
        createdBy: authUserId,
        participants: [{
          userId: authUserId,
          username,
          color: COLORS[0],
          socketId: socket.id,
        }],
        story: [],
        createdAt: new Date(),
      };
      rooms.set(roomId, room);
      socket.join(roomId);
      socket.emit("collab:room_created", { roomId, room });
    });

    // Join an existing room
    socket.on("collab:join_room", ({ roomId, username }: { roomId: string; username?: string }) => {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("collab:error", { message: "Room not found" });
        return;
      }

      const resolvedUsername = username || authUsername;
      const existingParticipant = room.participants.find(p => p.userId === authUserId);
      if (!existingParticipant) {
        const color = getColorForUser(room.participants.length);
        room.participants.push({ userId: authUserId, username: resolvedUsername, color, socketId: socket.id });
      } else {
        existingParticipant.socketId = socket.id;
        if (resolvedUsername) existingParticipant.username = resolvedUsername;
      }

      socket.join(roomId);
      collabNamespace.to(roomId).emit("collab:room_updated", { room });
      socket.emit("collab:joined", { room });
    });

    // User adds text to story
    socket.on("collab:add_text", ({ roomId, text }: { roomId: string; text: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const participant = room.participants.find(p => p.userId === authUserId);
      if (!participant) {
        socket.emit("collab:error", { message: "You are not a participant of this room" });
        return;
      }

      const chunk: IStoryChunk = {
        authorId: authUserId,
        authorName: participant.username,
        color: participant.color,
        text,
        isAI: false,
        timestamp: new Date(),
      };

      room.story.push(chunk);
      collabNamespace.to(roomId).emit("collab:story_updated", { story: room.story, newChunk: chunk });
    });

    // AI continues the story
    socket.on("collab:ai_continue", async ({ roomId }: { roomId: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      // Only participants of a room can trigger the AI
      const participant = room.participants.find(p => p.userId === authUserId);
      if (!participant) {
        socket.emit("collab:error", { message: "You are not a participant of this room" });
        return;
      }

      collabNamespace.to(roomId).emit("collab:ai_thinking", { roomId });

      let aiText = "";
      try {
        const fullContext = room.story.map(chunk => chunk.text).join(" ");
        const prompt = `Continue the following story naturally and creatively in 2-3 sentences:\n\n${fullContext}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        aiText = result.response.text();
      } catch (error) {
        logger.error("AI collaboration generation failed", error);
        aiText = "...the AI lost its train of thought. Please try again.";
      }

      const aiChunk: IStoryChunk = {
        authorId: "ai",
        authorName: "✨ AI",
        color: "#d4af37",
        text: aiText,
        isAI: true,
        timestamp: new Date(),
      };

      room.story.push(aiChunk);
      collabNamespace.to(roomId).emit("collab:story_updated", {
        story: room.story,
        newChunk: aiChunk
      });
    });

    // Typing indicator
    socket.on("collab:typing", ({ roomId, username }: { roomId: string; username?: string }) => {
      socket.to(roomId).emit("collab:user_typing", {
        userId: authUserId,
        username: username || authUsername,
      });
    });

    socket.on("collab:stop_typing", ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit("collab:user_stop_typing", { userId: authUserId });
    });

    // Get room info
    socket.on("collab:get_room", ({ roomId }: { roomId: string }) => {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("collab:error", { message: "Room not found" });
        return;
      }
      socket.emit("collab:room_info", { room });
    });

    // Disconnect
    socket.on("disconnect", () => {
      rooms.forEach((room) => {
        room.participants = room.participants.filter(
          p => p.socketId !== socket.id
        );
        if (room.participants.length === 0) {
          rooms.delete(room.roomId);
        } else {
          collabNamespace.to(room.roomId).emit("collab:room_updated", { room });
        }
      });
    });
  });
};
