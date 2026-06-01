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
exports.raceGenerationWithTimeout = exports.GenerationAbortedError = exports.GenerationTimeoutError = void 0;
class GenerationTimeoutError extends Error {
    constructor(message = "Generation timed out") {
        super(message);
        this.name = "GenerationTimeoutError";
    }
}
exports.GenerationTimeoutError = GenerationTimeoutError;
class GenerationAbortedError extends Error {
    constructor(message = "Generation aborted") {
        super(message);
        this.name = "GenerationAbortedError";
    }
}
exports.GenerationAbortedError = GenerationAbortedError;
/**
 * Races generation against a timeout; aborts via AbortSignal when time expires or after completion.
 */
const raceGenerationWithTimeout = (operation, timeLimitMs) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new AbortController();
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new GenerationTimeoutError());
        }, timeLimitMs);
        operation(controller.signal)
            .then((result) => {
            clearTimeout(timeoutId);
            controller.abort();
            resolve(result);
        })
            .catch((error) => {
            clearTimeout(timeoutId);
            controller.abort();
            if (controller.signal.aborted) {
                reject(new GenerationTimeoutError());
                return;
            }
            reject(error);
        });
    });
});
exports.raceGenerationWithTimeout = raceGenerationWithTimeout;
