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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryBranchingController = void 0;
const ai_service_1 = require("../services/ai.service");
exports.StoryBranchingController = {
    createBranchingStory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { storyContext, selectedChoice, genre } = req.body;
            // Build prompt from existing fields
            const prompt = `
        Genre: ${genre || "general"}
        Story so far: ${storyContext}
        The user chose: ${selectedChoice}
        Continue the story based on this choice.
      `;
            const result = yield (0, ai_service_1.generateStory)(prompt);
            return res.status(200).json({
                story: result.story,
                provider: result.provider,
                fallbackUsed: result.fallbackUsed,
            });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Unexpected error during story generation";
            return res.status(503).json({ message });
        }
    })
};
