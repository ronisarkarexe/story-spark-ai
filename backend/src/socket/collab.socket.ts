import { Server, Socket } from "socket.io";
import { User } from "../app/modules/user/user.model";
import { REQUEST_LIMITS } from "../interfaces/ai_model_request_limit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config";

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    console.log("Collab socket connected:", socket.id);

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

      const userId = socket.data.userId;
      if (!userId) {
        socket.emit("collab:error", { message: "Unauthorized" });
        return;
      }

      // 1. Participant Authorization Check
      const participant = room.participants.find(p => p.userId === userId);
      if (!participant) {
        socket.emit("collab:error", { message: "You are not a participant of this room" });
        return;
      }

      // Check if user exists in the DB
      const user = await User.findById(userId);
      if (!user) {
        socket.emit("collab:error", { message: "User not found!" });
        return;
      }

      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      try {
        // 2. Idempotent monthly reset
        if (user.lastRequestDate && user.lastRequestDate < firstDayOfMonth) {
          await User.updateOne(
            { email: user.email, lastRequestDate: { $lt: firstDayOfMonth } },
            { $set: { requestsThisMonth: 0, lastRequestDate: currentDate } }
          );
        }

        const requestLimit =
          REQUEST_LIMITS[user.subscriptionType as keyof typeof REQUEST_LIMITS] || REQUEST_LIMITS.free;

        // 3. Atomic Quota Reservation to protect against concurrency race conditions
        const updatedUser = await User.findOneAndUpdate(
          {
            email: user.email,
            requestsThisMonth: { $lt: requestLimit },
          },
          {
            $inc: { requestsThisMonth: 1 },
            $set: { lastRequestDate: currentDate },
          },
          { new: true }
        );

        if (!updatedUser) {
          socket.emit("collab:error", { message: "Monthly request limit exceeded!" });
          return;
        }

        // 4. Emit AI Thinking ONLY after quota check succeeds to prevent infinite loading state spams
        collabNamespace.to(roomId).emit("collab:ai_thinking", { roomId });

        let aiText = "";
        try {
          const fullContext = room.story.map(chunk => chunk.text).join("\n");
          const prompt = `Continue the following story naturally and creatively in 2-3 sentences based on the context. Return ONLY the continuation text, do not add any quotes, titles, JSON, formatting, or labels:\n\nStory Context:\n${fullContext}\n\nContinuation:`;

          const result = await model.generateContent(prompt);
          aiText = result.response.text().trim();
          
          if (!aiText) {
            throw new Error("Empty response from AI");
          }
        } catch (error) {
          // Rollback quota on failure
          await User.updateOne(
            { email: user.email, requestsThisMonth: { $gt: 0 } },
            { $inc: { requestsThisMonth: -1 } }
          );
          
          // Clear loading spinner on all screens
          collabNamespace.to(roomId).emit("collab:user_stop_typing", { userId: "ai" });
          
          socket.emit("collab:error", { message: "AI continuation failed" });
          return;
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
        
        // Broadcast the update to the entire room
        collabNamespace.to(roomId).emit("collab:story_updated", {
          story: room.story,
          newChunk: aiChunk
        });
        
        // Stop the thinking indicator on all screens
        collabNamespace.to(roomId).emit("collab:user_stop_typing", { userId: "ai" });

      } catch (err) {
        // Clear loading spinner on all screens
        collabNamespace.to(roomId).emit("collab:user_stop_typing", { userId: "ai" });
        socket.emit("collab:error", { message: "AI continuation failed" });
      }
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