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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/continue", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = req.body;
        // Replace this with existing AI generation logic
        const generatedText = "This is the generated continuation chapter.";
        res.json({
            text: generatedText,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to continue story",
        });
    }
}));
// Add this new route to handle reviews
// Since app.ts already adds "/review", the full path becomes "/review/create"
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Data received:", req.body);
        res.status(201).json({ message: "Review submitted successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to save" });
    }
}));
exports.default = router;
