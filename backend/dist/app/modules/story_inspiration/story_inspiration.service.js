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
exports.StoryInspirationService = void 0;
const cleanIntro = (intro) => intro.trim().replace(/\s+/g, " ");
const previewIntro = (intro) => intro.length > 140 ? `${intro.slice(0, 137).trim()}...` : intro;
const createStoryInspiration = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const intro = previewIntro(cleanIntro(payload.intro));
    return {
        ideas: [
            `Raise the stakes around "${intro}" by giving the main character one urgent choice with a clear cost.`,
            `Turn the opening into a mystery: add one detail that does not belong and let the character investigate it.`,
            `Introduce a rival or ally who knows more about the situation than they are willing to admit.`,
            `Move the next scene to a more pressured setting where the character cannot easily walk away.`,
            `Reveal that the intro is hiding a larger conflict, then end the next scene on a decision or discovery.`,
        ],
    };
});
exports.StoryInspirationService = {
    createStoryInspiration,
};
