"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCollabSocket = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const ai_model_service_1 = require("../app/modules/ai_model/ai_model.service");
const config_1 = __importDefault(require("../config"));
const jwt_helper_1 = require("../utils/jwt.helper");
const user_model_1 = require("../app/modules/user/user.model");
const quota_service_1 = require("../app/modules/ai_model/quota.service");
const quota_lifecycle_1 = require("../app/modules/ai_model/quota.lifecycle");
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
const rooms = new Map();
const cleanupTimeouts = new Map();
function generateRoomId() {
    // 128 bits of CSPRNG entropy so the room id is an unguessable join capability.
    return crypto_1.default.randomBytes(16).toString("hex");
}
function getColorForUser(index) {
    return COLORS[index % COLORS.length];
}
const setupCollabSocket = (io) => {
    const collabNamespace = io.of("/collab");
    collabNamespace.use((socket, next) => {
        var _a;
        try {
            const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
            if (!token)
                return next(new Error("Unauthorized"));
            const verifiedUser = jwt_helper_1.JwtHalers.verifyToken(token, config_1.default.jwt.secret);
            const userId = verifiedUser._id ||
                verifiedUser.userId ||
                verifiedUser.sub ||
                verifiedUser.id;
            if (!userId)
                return next(new Error("Unauthorized"));
            socket.data.userId = userId.toString();
            socket.data.username = verifiedUser.name || "Unknown User";
            next();
        }
        catch (error) {
            next(new Error("Unauthorized"));
        }
    });
    collabNamespace.on("connection", (socket) => {
        logger_util_1.default.debug("Collab socket connected");
        // Create a new room
        socket.on("collab:create_room", () => {
            const userId = socket.data.userId;
            const username = socket.data.username;
            const roomId = generateRoomId();
            const room = {
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
                createdAt: new Date(),
            };
            rooms.set(roomId, room);
            socket.join(roomId);
            socket.emit("collab:room_created", { roomId, room });
        });
        // Join an existing room
        socket.on("collab:join_room", ({ roomId }) => {
            const pendingCleanup = cleanupTimeouts.get(roomId);
            if (pendingCleanup) {
                clearTimeout(pendingCleanup);
                cleanupTimeouts.delete(roomId);
            }
            const userId = socket.data.userId;
            const username = socket.data.username;
            const room = rooms.get(roomId);
            if (!room) {
                socket.emit("collab:error", { message: "Room not found" });
                return;
            }
            const existingParticipant = room.participants.find((p) => p.userId === userId);
            if (!existingParticipant) {
                const color = getColorForUser(room.participants.length);
                room.participants.push({
                    userId,
                    username,
                    color,
                    socketId: socket.id,
                });
            }
            else {
                existingParticipant.socketId = socket.id;
            }
            socket.join(roomId);
            collabNamespace.to(roomId).emit("collab:room_updated", { room });
            socket.emit("collab:joined", { room });
        });
        // User adds text to story
        socket.on("collab:add_text", ({ roomId, text }) => {
            const userId = socket.data.userId;
            const room = rooms.get(roomId);
            if (!room)
                return;
            const participant = room.participants.find((p) => p.userId === userId);
            if (!participant) {
                socket.emit("collab:error", {
                    message: "You are not a participant of this room",
                });
                return;
            }
            const chunk = {
                authorId: userId,
                authorName: participant.username,
                color: participant.color,
                text,
                isAI: false,
                timestamp: new Date(),
            };
            room.story.push(chunk);
            collabNamespace
                .to(roomId)
                .emit("collab:story_updated", { story: room.story, newChunk: chunk });
        });
        // AI continues the story
        socket.on("collab:ai_continue", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId }) {
            const room = rooms.get(roomId);
            if (!room)
                return;
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
            const user = yield user_model_1.User.findById(userId);
            if (!user) {
                socket.emit("collab:error", { message: "User not found!" });
                return;
            }
            try {
                yield (0, quota_service_1.reserveUserQuota)(user.email);
            }
            catch (error) {
                const errorMsg = error instanceof Error
                    ? error.message
                    : "Monthly request limit exceeded!";
                socket.emit("collab:error", { message: errorMsg });
                return;
            }
            const guard = (0, quota_lifecycle_1.createUserQuotaGuard)(user.email);
            try {
                yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
                    var _a, _b;
                    collabNamespace.to(roomId).emit("collab:ai_thinking", { roomId });
                    const storyContext = room.story
                        .map((chunk) => chunk.text)
                        .filter(Boolean)
                        .join("\n");
                    const prompt = storyContext
                        ? `Continue the following story naturally and creatively in 2-3 sentences based on the context. Return ONLY the continuation text, do not add any quotes, titles, JSON, formatting, or labels:\n\nStory Context:\n${storyContext}\n\nContinuation:`
                        : "Start a collaborative story naturally and creatively in 2-3 sentences. Return ONLY the story text, do not add any quotes, titles, JSON, formatting, or labels.";
                    const result = yield ai_model_service_1.AiModelService.aiFreeModelGenerate({
                        prompt,
                        wordLength: 120,
                        numStories: 1,
                        language: "English",
                    });
                    const continuationText = (_b = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!continuationText) {
                        throw new Error("Empty response from AI");
                    }
                    const aiChunk = {
                        authorId: "ai",
                        authorName: "✨ AI",
                        color: "#d4af37",
                        text: continuationText,
                        isAI: true,
                        timestamp: new Date(),
                    };
                    room.story.push(aiChunk);
                    collabNamespace.to(roomId).emit("collab:story_updated", {
                        story: room.story,
                        newChunk: aiChunk,
                    });
                }));
            }
            catch (error) {
                logger_util_1.default.error("AI collaboration generation failed", error);
                socket.emit("collab:error", {
                    message: "AI continuation failed. Please try again.",
                });
            }
            finally {
                collabNamespace.to(roomId).emit("collab:user_stop_typing", {
                    userId: "ai",
                });
            }
        }));
        // Typing indicator
        socket.on("collab:typing", ({ roomId }) => {
            const userId = socket.data.userId;
            const username = socket.data.username;
            const room = rooms.get(roomId);
            if (!room)
                return;
            if (!room.participants.some((p) => p.userId === userId))
                return;
            socket.to(roomId).emit("collab:user_typing", { userId, username });
        });
        socket.on("collab:stop_typing", ({ roomId }) => {
            const userId = socket.data.userId;
            const room = rooms.get(roomId);
            if (!room)
                return;
            if (!room.participants.some((p) => p.userId === userId))
                return;
            socket.to(roomId).emit("collab:user_stop_typing", { userId });
        });
        // Get room info
        socket.on("collab:get_room", ({ roomId }) => {
            const pendingCleanup = cleanupTimeouts.get(roomId);
            if (pendingCleanup) {
                clearTimeout(pendingCleanup);
                cleanupTimeouts.delete(roomId);
            }
            const userId = socket.data.userId;
            const room = rooms.get(roomId);
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
        });
        // Disconnect
        socket.on("disconnect", () => {
            rooms.forEach((room) => {
                room.participants = room.participants.filter((p) => p.socketId !== socket.id);
                if (room.participants.length === 0) {
                    // Clear any existing cleanup timeout to prevent duplicate timer runs
                    const existingTimeout = cleanupTimeouts.get(room.roomId);
                    if (existingTimeout)
                        clearTimeout(existingTimeout);
                    // Schedule permanent room eviction in 5 minutes (grace period)
                    const timeout = setTimeout(() => {
                        rooms.delete(room.roomId);
                        cleanupTimeouts.delete(room.roomId);
                    }, 5 * 60 * 1000);
                    cleanupTimeouts.set(room.roomId, timeout);
                }
                else {
                    collabNamespace.to(room.roomId).emit("collab:room_updated", { room });
                }
            });
        });
    });
};
exports.setupCollabSocket = setupCollabSocket;
