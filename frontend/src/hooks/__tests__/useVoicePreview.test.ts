/**
 * useVoicePreview.test.ts
 * Unit tests for the useVoicePreview React hook.
 *
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useVoicePreview from "../useVoicePreview";
import { SpeechVoiceOption } from "../useSpeechSynthesis";

const makeVoice = (id: string, lang = "en-US"): SpeechVoiceOption => ({
  id,
  label: `Voice ${id}`,
  lang,
});

const mockUtteranceInstance = {
  lang: "",
  rate: 1,
  voice: null as SpeechSynthesisVoice | null,
  onstart: null as ((event: SpeechSynthesisEvent) => void) | null,
  onend: null as ((event: SpeechSynthesisEvent) => void) | null,
  onerror: null as ((event: SpeechSynthesisErrorEvent) => void) | null,
};

let mockGetVoices: () => SpeechSynthesisVoice[];
let mockCancel: ReturnType<typeof vi.fn>;
let mockSpeak: ReturnType<typeof vi.fn>;

const mockSpeechSynthesis = {
  getVoices: () => mockGetVoices(),
  speak: mockSpeak,
  cancel: mockCancel,
};

const MockSpeechSynthesisUtterance = vi.fn(() => {
  const instance = { ...mockUtteranceInstance };
  Object.defineProperty(instance, "onstart", {
    set(fn: ((event: SpeechSynthesisEvent) => void) | null) {
      mockUtteranceInstance.onstart = fn;
    },
    get() {
      return mockUtteranceInstance.onstart;
    },
  });
  Object.defineProperty(instance, "onend", {
    set(fn: ((event: SpeechSynthesisEvent) => void) | null) {
      mockUtteranceInstance.onend = fn;
    },
    get() {
      return mockUtteranceInstance.onend;
    },
  });
  Object.defineProperty(instance, "onerror", {
    set(fn: ((event: SpeechSynthesisErrorEvent) => void) | null) {
      mockUtteranceInstance.onerror = fn;
    },
    get() {
      return mockUtteranceInstance.onerror;
    },
  });
  return instance;
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();

  mockGetVoices = vi.fn(() => []);
  mockCancel = vi.fn();
  mockSpeak = vi.fn();

  Object.defineProperty(window, "speechSynthesis", {
    value: mockSpeechSynthesis,
    writable: true,
  });

  // Mock SpeechSynthesisUtterance globally
  const globalAny = global as typeof globalThis & {
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
  };
  globalAny.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useVoicePreview", () => {
  it("initializes with no active preview", () => {
    const { result } = renderHook(() => useVoicePreview());
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it("playPreview sets previewingVoiceId and isPreviewPlaying to true", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = makeVoice("voice-1", "en-US");

    act(() => {
      result.current.playPreview(voice);
    });

    // Simulate utterance onstart event
    act(() => {
      mockUtteranceInstance.onstart?.({} as SpeechSynthesisEvent);
    });

    expect(result.current.previewingVoiceId).toBe("voice-1");
    expect(result.current.isPreviewPlaying).toBe(true);
  });

  it("playPreview calls window.speechSynthesis.speak with the preview text", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = makeVoice("voice-2", "en-GB");

    act(() => {
      result.current.playPreview(voice);
    });

    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  it("playPreview stops any previous preview before starting a new one", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice1 = makeVoice("voice-a");
    const voice2 = makeVoice("voice-b");

    act(() => {
      result.current.playPreview(voice1);
    });

    act(() => {
      result.current.playPreview(voice2);
    });

    // stopPreview should have been called before the second play
    expect(mockCancel).toHaveBeenCalled();
  });

  it("stopPreview resets previewingVoiceId and isPreviewPlaying to false", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = makeVoice("voice-stop");

    act(() => {
      result.current.playPreview(voice);
    });

    act(() => {
      mockUtteranceInstance.onstart?.({} as SpeechSynthesisEvent);
    });

    expect(result.current.isPreviewPlaying).toBe(true);

    act(() => {
      result.current.stopPreview();
    });

    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
    expect(mockCancel).toHaveBeenCalled();
  });

  it("onend event callback resets state", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = makeVoice("voice-end");

    act(() => {
      result.current.playPreview(voice);
    });

    act(() => {
      mockUtteranceInstance.onstart?.({} as SpeechSynthesisEvent);
    });

    expect(result.current.isPreviewPlaying).toBe(true);

    act(() => {
      mockUtteranceInstance.onend?.({} as SpeechSynthesisEvent);
    });

    expect(result.current.isPreviewPlaying).toBe(false);
    expect(result.current.previewingVoiceId).toBeNull();
  });

  it("onerror event callback resets state", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = makeVoice("voice-error");

    act(() => {
      result.current.playPreview(voice);
    });

    act(() => {
      mockUtteranceInstance.onstart?.({} as SpeechSynthesisEvent);
    });

    expect(result.current.isPreviewPlaying).toBe(true);

    act(() => {
      mockUtteranceInstance.onerror?.({} as SpeechSynthesisErrorEvent);
    });

    expect(result.current.isPreviewPlaying).toBe(false);
    expect(result.current.previewingVoiceId).toBeNull();
  });
});
