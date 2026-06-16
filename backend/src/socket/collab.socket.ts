import { Server, Socket } from "socket.io";
import crypto from "crypto";
import logger from "../utils/logger.util";
import { AiModelService } from "../app/modules/ai_model/ai_model.service";
import config from "../config";
import { JwtHelpers } from "../utils/jwt.helper";
import type { Secret } from "jsonwebtoken";
import { User } from "../app/modules/user/user.model";
import { reserveUserQuota } from "../app/modules/ai_model/quota.service";
import { createUserQuotaGuard, runWithQuotaCleanup } from "../app/modules/ai_model/quota.lifecycle";
import { CollabRoom } from "../app/modules/collab/collab.model";
import { IStoryChunk } from "../app/modules/collab/collab.interface";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
];

function generateRoomId(): string {
  // 128 bits of CSPRNG entropy so the room id is an unguessable join capability.
  return crypto.randomBytes(16).toString("hex");
}

function getColorForUser(index: number): string {
  return COLORS[index % COLORS.length];
}

export const setupCollabSocket = (io: Server) => {
  const collabNamespace = io.of("/collab");

  collabNamespace.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) return next(new Error("Unauthorized"));
      
      const verifiedUser = JwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      const userId = verifiedUser._id || verifiedUser.userId || verifiedUser.sub || verifiedUser.id;
      if (!userId) return next(new Error("Unauthorized"));

      socket.data.userId = userId.toString();
      socket.data.username = verifiedUser.name || "Unknown User";
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  collabNamespace.on("connection", (socket: Socket) => {
    logger.debug("Collab socket connected");

    // Create a new room
    socket.on("collab:create_room", async () => {
      try {
        const userId = socket.data.userId;
        const username = socket.data.username;
        const roomId = generateRoomId();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours TTL

        const newRoom = new CollabRoom({
          roomId,
          createdBy: userId,
          participants: [
            {
              userId,
              username,
              color: COLORS[0],
              socketId: socket.id,
            },
          ],
          story: [],
          expiresAt,
        });

        await newRoom.save();
        socket.join(roomId);
        socket.emit("collab:room_created", { roomId, room: newRoom });
      } catch (error) {
        logger.error("Failed to create collab room", error);
        socket.emit("collab:error", { message: "Failed to create collaboration room." });
      }
    });

    // Join an existing room
    socket.on("collab:join_room", async ({ roomId }) => {
      try {
        const userId = socket.data.userId;
        const username = socket.data.username;

        const room = await CollabRoom.findOne({ roomId });
        if (!room) {
          socket.emit("collab:error", { message: "Room not found" });
          return;
        }

        const existingParticipantIndex = room.participants.findIndex(
          (p) => p.userId === userId,
        );

        if (existingParticipantIndex === -1) {
          const color = getColorForUser(room.participants.length);
          room.participants.push({
            userId,
            username,
            color,
            socketId: socket.id,
          });
        } else {
          room.participants[existingParticipantIndex].socketId = socket.id;
        }

        await room.save();
        socket.join(roomId);
        collabNamespace.to(roomId).emit("collab:room_updated", { room });
        socket.emit("collab:joined", { room });
      } catch (error) {
        logger.error("Failed to join collab room", error);
        socket.emit("collab:error", { message: "Failed to join collaboration room." });
      }
    });

    // User adds text to story
    socket.on("collab:add_text", async ({ roomId, text }) => {
      try {
        const userId = socket.data.userId;
        const room = await CollabRoom.findOne({ roomId });
        if (!room) return;

        const participant = room.participants.find((p) => p.userId === userId);
        if (!participant) {
          socket.emit("collab:error", {
            message: "You are not a participant of this room",
          });
          return;
        }

        const chunk: IStoryChunk = {
          authorId: userId,
          authorName: participant.username,
          color: participant.color,
          text,
          isAI: false,
          timestamp: new Date(),
        };

        room.story.push(chunk);
        await room.save();

        collabNamespace
          .to(roomId)
          .emit("collab:story_updated", { story: room.story, newChunk: chunk });
      } catch (error) {
        logger.error("Failed to add text to collab room", error);
        socket.emit("collab:error", { message: "Failed to add text." });
      }
    });

    // Yjs document updates
socket.on("collab:yjs-update", ({ roomId, update }) => {
  const room = rooms.get(roomId);

  if (!room) {
    socket.emit("collab:error", {
      message: "Room not found",
    });
    return;
  }

  socket.to(roomId).emit("collab:yjs-update", {
    update,
  });
});

// Awareness / cursor updates
socket.on("collab:awareness", ({ roomId, awareness }) => {
  const room = rooms.get(roomId);

  if (!room) {
    socket.emit("collab:error", {
      message: "Room not found",
    });
    return;
  }

  socket.to(roomId).emit("collab:awareness", {
    awareness,
  });
});

    // AI continues the story
    socket.on("collab:ai_continue", async ({ roomId }) => {
      try {
        const room = await CollabRoom.findOne({ roomId });
        if (!room) return;

        const userId = socket.data.userId;
        if (!userId) {
          socket.emit("collab:error", { message: "Unauthorized" });
          return;
        }

        const participant = room.participants.find((p) => p.userId === userId);
        if (!participant) {
          socket.emit("collab:error", {
            message: "You are not a participant of this room",
          });
          return;
        }

        const user = await User.findById(userId);
        if (!user) {
          socket.emit("collab:error", { message: "User not found!" });
          return;
        }

        try {
          await reserveUserQuota(user.email);
        } catch (error: any) {
          const errorMsg =
            error instanceof Error
              ? error.message
              : "Monthly request limit exceeded!";
          socket.emit("collab:error", { message: errorMsg });
          return;
        }

        const guard = createUserQuotaGuard(user.email);

        try {
          await runWithQuotaCleanup(guard, async () => {
            collabNamespace.to(roomId).emit("collab:ai_thinking", { roomId });

            const storyContext = room.story
              .map((chunk) => chunk.text)
              .filter(Boolean)
              .join("\n");

            const prompt = storyContext
              ? `Continue the following story naturally and creatively in 2-3 sentences based on the context. Return ONLY the continuation text, do not add any quotes, titles, JSON, formatting, or labels:\n\nStory Context:\n${storyContext}\n\nContinuation:`
              : "Start a collaborative story naturally and creatively in 2-3 sentences. Return ONLY the story text, do not add any quotes, titles, JSON, formatting, or labels.";

            const result = await AiModelService.aiFreeStoryContinuation({
              prompt,
              language: "English",
            });

            const continuationText = result?.continuation?.trim();

            if (!continuationText) {
              throw new Error("Empty response from AI");
            }

            const aiChunk: IStoryChunk = {
              authorId: "ai",
              authorName: "✨ AI",
              color: "#d4af37",
              text: continuationText,
              isAI: true,
              timestamp: new Date(),
            };

            const latestRoom = await CollabRoom.findOne({ roomId });
            if (latestRoom) {
              latestRoom.story.push(aiChunk);
              await latestRoom.save();

              collabNamespace.to(roomId).emit("collab:story_updated", {
                story: latestRoom.story,
                newChunk: aiChunk,
              });
            }
          });
        } catch (error) {
          logger.error("AI collaboration generation failed", error);
          socket.emit("collab:error", {
            message: "AI continuation failed. Please try again.",
          });
        } finally {
          collabNamespace.to(roomId).emit("collab:user_stop_typing", {
            userId: "ai",
          });
        }
      } catch (err) {
        logger.error("Error in AI continuation process", err);
      }
    });

    // Typing indicator
    socket.on("collab:typing", async ({ roomId }) => {
      try {
        const userId = socket.data.userId;
        const username = socket.data.username;
        const room = await CollabRoom.findOne({ roomId });
        if (!room) return;
        if (!room.participants.some((p) => p.userId === userId)) return;
        socket.to(roomId).emit("collab:user_typing", { userId, username });
      } catch (error) {
        logger.error("collab:typing event error", error);
      }
    });

    socket.on("collab:stop_typing", async ({ roomId }) => {
      try {
        const userId = socket.data.userId;
        const room = await CollabRoom.findOne({ roomId });
        if (!room) return;
        if (!room.participants.some((p) => p.userId === userId)) return;
        socket.to(roomId).emit("collab:user_stop_typing", { userId });
      } catch (error) {
        logger.error("collab:stop_typing event error", error);
      }
    });

    // Get room info
    socket.on("collab:get_room", async ({ roomId }) => {
      try {
        const userId = socket.data.userId;
        const room = await CollabRoom.findOne({ roomId });
        if (!room) {
          socket.emit("collab:error", { message: "Room not found" });
          return;
        }
        if (!room.participants.some((p) => p.userId === userId)) {
          socket.emit("collab:error", {
            message: "You are not a participant of this room",
          });
          return;
        }
        socket.emit("collab:room_info", { room });
      } catch (error) {
        logger.error("collab:get_room error", error);
        socket.emit("collab:error", { message: "Failed to get room information" });
      }
    });

    // Disconnect
    socket.on("disconnect", async () => {
      try {
        const rooms = await CollabRoom.find({ "participants.socketId": socket.id });
        for (const room of rooms) {
          room.participants = room.participants.filter(
            (p) => p.socketId !== socket.id,
          );
          await room.save();
          collabNamespace.to(room.roomId).emit("collab:room_updated", { room });
        }
      } catch (error) {
        logger.error("Error during socket disconnect cleanup", error);
      }
    });
  });
};
