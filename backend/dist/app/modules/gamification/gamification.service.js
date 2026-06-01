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
exports.GamificationService = void 0;
const user_model_1 = require("../user/user.model");
const updateDailyStreak = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user)
            return;
        if (!user.gamification) {
            user.gamification = { xp: 0, level: 1, streak: 0, badges: [], lastActiveDate: null };
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let lastActive = user.gamification.lastActiveDate;
        if (!lastActive) {
            user.gamification.streak = 1;
            user.gamification.lastActiveDate = new Date();
            yield user.save();
            yield addXp(userId, 10, "First login");
            return;
        }
        const lastActiveDate = new Date(lastActive);
        lastActiveDate.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - lastActiveDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            // Logged in yesterday
            user.gamification.streak += 1;
            user.gamification.lastActiveDate = new Date();
            yield user.save();
            yield addXp(userId, 10, "Daily Streak XP");
        }
        else if (diffDays > 1) {
            // Missed a day
            user.gamification.streak = 1;
            user.gamification.lastActiveDate = new Date();
            yield user.save();
            yield addXp(userId, 10, "Daily Login XP");
        }
    }
    catch (error) {
        console.error("Error updating daily streak:", error);
    }
});
const addXp = (userId, amount, reason) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user)
            return;
        if (!user.gamification) {
            user.gamification = { xp: 0, level: 1, streak: 0, badges: [], lastActiveDate: null };
        }
        const currentXp = user.gamification.xp || 0;
        const newXp = currentXp + amount;
        // Level formula: Level = floor(sqrt(xp / 100)) + 1
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        user.gamification.xp = newXp;
        if (newLevel > user.gamification.level) {
            user.gamification.level = newLevel;
        }
        yield user.save();
    }
    catch (error) {
        console.error("Error adding XP:", error);
    }
});
const awardBadge = (userId, badgeName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user)
            return;
        if (!user.gamification) {
            user.gamification = { xp: 0, level: 1, streak: 0, badges: [], lastActiveDate: null };
        }
        if (!user.gamification.badges.includes(badgeName)) {
            user.gamification.badges.push(badgeName);
            yield user.save();
        }
    }
    catch (error) {
        console.error("Error awarding badge:", error);
    }
});
exports.GamificationService = {
    updateDailyStreak,
    addXp,
    awardBadge,
};
