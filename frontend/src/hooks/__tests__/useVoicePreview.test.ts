import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useVoicePreview } from "../useVoicePreview";

const mockVoices = [
  { name: "Google US English", lang: "en-US", voiceURI: "google-us" },
  { name: "Google UK English Male", lang: "en-GB", voiceURI: "google-uk" },
];

describe("useVoicePreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock speechSynthesis global methods
    const mockSpeechSynthesis = {
      speak: vi.fn((utterance: SpeechSynthesisUtterance) => {
        // Trigger onstart immediately in mock
        if (utterance.onstart) {
          utterance.onstart(new Event("start") as any);
        }
      }),
      cancel: vi.fn(),
      getVoices: vi.fn(() => mockVoices),
    };

    Object.defineProperty(window, "speechSynthesis", {
      value: mockSpeechSynthesis,
      writable: true,
      configurable: true,
    });

    // Mock SpeechSynthesisUtterance
    class MockUtterance {
      lang = "";
      rate = 1;
      voice = null;
      onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null = null;
      onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null = null;
      onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null = null;
      constructor(public text: string) {}
    }

    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: MockUtterance,
      writable: true,
      configurable: true,
    });
  });

  it("should initialize with previewingVoiceId null and isPreviewPlaying false", () => {
    const { result } = renderHook(() => useVoicePreview());
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it("should play voice preview successfully", () => {
    const { result } = renderHook(() => useVoicePreview());

    act(() => {
      result.current.playPreview({
        id: "google-us",
        name: "Google US English",
        lang: "en-US",
      });
    });

    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    expect(result.current.previewingVoiceId).toBe("google-us");
    expect(result.current.isPreviewPlaying).toBe(true);
  });

  it("should stop preview when stopPreview is called", () => {
    const { result } = renderHook(() => useVoicePreview());

    act(() => {
      result.current.playPreview({
        id: "google-us",
        name: "Google US English",
        lang: "en-US",
      });
    });

    act(() => {
      result.current.stopPreview();
    });

    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });
});
