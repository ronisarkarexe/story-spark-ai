/**
 * useSpeechSynthesis.test.ts
 * Unit tests for the useSpeechSynthesis React hook.
 *
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useSpeechSynthesis from "../useSpeechSynthesis";

let mockUtteranceInstance: {
    lang: string;
    rate: number;
    pitch: number;
    volume: number;
    voice: SpeechSynthesisVoice | null;
    onstart: ((event: SpeechSynthesisEvent) => void) | null;
    onend: ((event: SpeechSynthesisEvent) => void) | null;
    onpause: ((event: Event) => void) | null;
    onresume: ((event: Event) => void) | null;
    onboundary: ((event: SpeechSynthesisEvent) => void) | null;
    onerror: ((event: SpeechSynthesisErrorEvent) => void) | null;
};

let mockGetVoices: () => SpeechSynthesisVoice[];
let mockCancel: ReturnType<typeof vi.fn>;
let mockSpeak: ReturnType<typeof vi.fn>;

const mockSpeechSynthesis = {
    getVoices: () => mockGetVoices(),
    speak: mockSpeak,
    cancel: mockCancel,
    onvoiceschanged: null as ((this: SpeechSynthesis, ev: Event) => any) | null,
};

const MockSpeechSynthesisUtterance = vi.fn(() => {
    const instance = {
        lang: "",
        rate: 1,
        pitch: 1,
        volume: 1,
        voice: null,
        onstart: null,
        onend: null,
        onpause: null,
        onresume: null,
        onboundary: null,
        onerror: null,
    };

    mockUtteranceInstance = instance;
    return instance as unknown as SpeechSynthesisUtterance;
});

beforeEach(() => {
    vi.clearAllMocks();

    mockGetVoices = vi.fn(() => []);
    mockCancel = vi.fn();
    mockSpeak = vi.fn();

    Object.defineProperty(window, "speechSynthesis", {
        value: mockSpeechSynthesis,
        writable: true,
    });

    const globalAny = global as typeof globalThis & {
        SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
    };
    globalAny.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
});

afterEach(() => {
    // Reset any state between tests.
    mockUtteranceInstance = null as unknown as typeof mockUtteranceInstance;
});

describe("useSpeechSynthesis", () => {
    it("does not set an error when utterance.onerror receives canceled", () => {
        const { result } = renderHook(() => useSpeechSynthesis("Hello world"));

        act(() => {
            result.current.play();
        });

        act(() => {
            mockUtteranceInstance.onstart?.({} as SpeechSynthesisEvent);
        });

        act(() => {
            result.current.stop();
        });

        act(() => {
            mockUtteranceInstance.onerror?.({
                error: "canceled",
            } as unknown as SpeechSynthesisErrorEvent);
        });

        expect(result.current.error).toBeNull();
    });

    it("does not set an error when utterance.onerror receives interrupted", () => {
        const { result } = renderHook(() => useSpeechSynthesis("Hello world"));

        act(() => {
            result.current.play();
        });

        act(() => {
            mockUtteranceInstance.onstart?.({} as SpeechSynthesisEvent);
        });

        act(() => {
            result.current.stop();
        });

        act(() => {
            mockUtteranceInstance.onerror?.({
                error: "interrupted",
            } as unknown as SpeechSynthesisErrorEvent);
        });

        expect(result.current.error).toBeNull();
    });

    it("sets the existing error message for other utterance errors", () => {
        const { result } = renderHook(() => useSpeechSynthesis("Hello world"));

        act(() => {
            result.current.play();
        });

        act(() => {
            mockUtteranceInstance.onstart?.({} as SpeechSynthesisEvent);
        });

        act(() => {
            mockUtteranceInstance.onerror?.({
                error: "network",
            } as unknown as SpeechSynthesisErrorEvent);
        });

        expect(result.current.error).toBe("Unable to play narration. Please try again.");
    });
});
