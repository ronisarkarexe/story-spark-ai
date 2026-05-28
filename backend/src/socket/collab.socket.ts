import { Server, Socket } from "socket.io";
import logger from "../utils/logger.util";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config";

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

  collabNamespace.on("connection", (socket: Socket) => {
    logger.debug("Collab socket connected");

    // Create a new room
    socket.on("collab:create_room", ({ userId, username }) => {
      const roomId = generateRoomId();
      const room: IRoom = {
        roomId,
        createdBy: userId,
        participants: [{
          userId,
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
    socket.on("collab:join_room", ({ roomId, userId, username }) => {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("collab:error", { message: "Room not found" });
        return;
      }

      const existingParticipant = room.participants.find(p => p.userId === userId);
      if (!existingParticipant) {
        const color = getColorForUser(room.participants.length);
        room.participants.push({ userId, username, color, socketId: socket.id });
      } else {
        existingParticipant.socketId = socket.id;
      }

      socket.join(roomId);
      collabNamespace.to(roomId).emit("collab:room_updated", { room });
      socket.emit("collab:joined", { room });
    });

    // User adds text to story
    socket.on("collab:add_text", ({ roomId, userId, text }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const participant = room.participants.find(p => p.userId === userId);
      if (!participant) return;

      const chunk: IStoryChunk = {
        authorId: userId,
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
    socket.on("collab:ai_continue", async ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

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
    socket.on("collab:typing", ({ roomId, userId, username }) => {
      socket.to(roomId).emit("collab:user_typing", { userId, username });
    });

    socket.on("collab:stop_typing", ({ roomId, userId }) => {
      socket.to(roomId).emit("collab:user_stop_typing", { userId });
    });

    // Get room info
    socket.on("collab:get_room", ({ roomId }) => {
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