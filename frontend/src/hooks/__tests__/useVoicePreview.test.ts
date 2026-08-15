/**
 * useVoicePreview.test.ts
 * Unit tests for the useVoicePreview React hook.
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

let mockSpeak: ReturnType<typeof vi.fn>;
let mockCancel: ReturnType<typeof vi.fn>;
let mockGetVoices: ReturnType<typeof vi.fn>;
let lastInstance: {
  lang: string;
  rate: number;
  voice: SpeechSynthesisVoice | null;
  onstart: ((e: SpeechSynthesisEvent) => void) | null;
  onend: ((e: SpeechSynthesisEvent) => void) | null;
  onerror: ((e: SpeechSynthesisErrorEvent) => void) | null;
};

function MockSpeechSynthesisUtterance(this: typeof lastInstance) {
  lastInstance = {
    lang: "",
    rate: 1,
    voice: null,
    onstart: null,
    onend: null,
    onerror: null,
  };
  return lastInstance;
}

const mockSpeechSynthesis = {
  getVoices: () => mockGetVoices(),
  speak: (u: unknown) => mockSpeak(u),
  cancel: () => mockCancel(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockGetVoices = vi.fn(() => []);
  mockSpeak = vi.fn();
  mockCancel = vi.fn();

  Object.defineProperty(window, "speechSynthesis", {
    value: mockSpeechSynthesis,
    writable: true,
    configurable: true,
  });

  const g = globalThis as typeof globalThis & {
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
  };
  g.SpeechSynthesisUtterance =
    MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useVoicePreview", () => {
  it("initializes with no active preview", () => {
    const { result } = renderHook(() => useVoicePreview());
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it("playPreview sets previewingVoiceId and isPreviewPlaying to true on start", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = makeVoice("voice-1", "en-US");

    act(() => {
      result.current.playPreview(voice);
    });

    act(() => {
      lastInstance.onstart?.({} as SpeechSynthesisEvent);
    });

    expect(result.current.previewingVoiceId).toBe("voice-1");
    expect(result.current.isPreviewPlaying).toBe(true);
  });

  it("playPreview calls window.speechSynthesis.speak with an utterance", () => {
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
      lastInstance.onstart?.({} as SpeechSynthesisEvent);
    });
    expect(result.current.isPreviewPlaying).toBe(true);

    act(() => {
      result.current.playPreview(voice2);
    });

    // stopPreview should have cancelled the previous utterance
    expect(mockCancel).toHaveBeenCalled();
  });

  it("stopPreview resets previewingVoiceId and isPreviewPlaying to false", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = makeVoice("voice-stop");

    act(() => {
      result.current.playPreview(voice);
    });
    act(() => {
      lastInstance.onstart?.({} as SpeechSynthesisEvent);
    });
    expect(result.current.isPreviewPlaying).toBe(true);

    act(() => {
      result.current.stopPreview();
    });

    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
    expect(mockCancel).toHaveBeenCalled();
  });

  it("stopPreview is a no-op for cancel when nothing is playing", () => {
    const { result } = renderHook(() => useVoicePreview());
    mockCancel.mockClear();

    act(() => {
      result.current.stopPreview();
    });

    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
    expect(mockCancel).not.toHaveBeenCalled();
  });

  it("onend event callback resets state", () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = makeVoice("voice-end");

    act(() => {
      result.current.playPreview(voice);
    });
    act(() => {
      lastInstance.onstart?.({} as SpeechSynthesisEvent);
    });
    expect(result.current.isPreviewPlaying).toBe(true);

    act(() => {
      lastInstance.onend?.({} as SpeechSynthesisEvent);
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
      lastInstance.onstart?.({} as SpeechSynthesisEvent);
    });
    expect(result.current.isPreviewPlaying).toBe(true);

    act(() => {
      lastInstance.onerror?.({} as SpeechSynthesisErrorEvent);
    });

    expect(result.current.isPreviewPlaying).toBe(false);
    expect(result.current.previewingVoiceId).toBeNull();
  });
});
