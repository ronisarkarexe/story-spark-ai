/**
 * useVoicePreview.test.ts
 * Unit tests for the useVoicePreview React hook.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVoicePreview } from "../useVoicePreview";

// Mock window.speechSynthesis and SpeechSynthesisUtterance globally
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockGetVoices = vi.fn();

// Track created utterances to trigger callbacks
const createdUtterances: Array<{
  text: string;
  lang: string;
  rate: number;
  voice: unknown;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
}> = [];

vi.stubGlobal("speechSynthesis", {
  speak: mockSpeak,
  cancel: mockCancel,
  getVoices: mockGetVoices,
  pause: vi.fn(),
  resume: vi.fn(),
  pending: false,
  speaking: false,
});

vi.stubGlobal(
  "SpeechSynthesisUtterance",
  class {
    text: string;
    lang = "";
    rate = 1;
    voice: unknown = null;
    onstart: ((event: Event) => void) | null = null;
    onend: ((event: Event) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;

    constructor(text: string) {
      this.text = text;
      createdUtterances.push(this);
      // Trigger onstart synchronously when speak is called (matches browser behavior)
      mockSpeak.mockImplementation(() => {
        setTimeout(() => {
          this.onstart?.({} as Event);
        }, 0);
      });
    }
  },
);

describe("useVoicePreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetVoices.mockReturnValue([]);
    createdUtterances.length = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with null previewingVoiceId and false isPreviewPlaying", () => {
    const { result } = renderHook(() => useVoicePreview());
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it("playPreview sets previewingVoiceId and isPreviewPlaying after onstart fires", async () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = { id: "voice-1", label: "Voice One", lang: "en-US" };

    act(() => {
      result.current.playPreview(voice);
    });

    // onstart is called asynchronously
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.previewingVoiceId).toBe("voice-1");
    expect(result.current.isPreviewPlaying).toBe(true);
  });

  it("playPreview calls speechSynthesis.speak once per preview", async () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = { id: "voice-1", label: "Voice One", lang: "en-US" };

    act(() => {
      result.current.playPreview(voice);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  it("playPreview cancels existing preview before starting a new one", async () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice1 = { id: "voice-1", label: "Voice One", lang: "en-US" };
    const voice2 = { id: "voice-2", label: "Voice Two", lang: "en-GB" };

    act(() => {
      result.current.playPreview(voice1);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.playPreview(voice2);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockSpeak).toHaveBeenCalledTimes(2);
  });

  it("stopPreview resets state and calls speechSynthesis.cancel", async () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = { id: "voice-1", label: "Voice One", lang: "en-US" };

    act(() => {
      result.current.playPreview(voice);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isPreviewPlaying).toBe(true);

    act(() => {
      result.current.stopPreview();
    });

    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it("stopPreview is safe to call when nothing is playing", () => {
    const { result } = renderHook(() => useVoicePreview());

    expect(() => result.current.stopPreview()).not.toThrow();
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it("playPreview applies matching browser voice when found", async () => {
    const { result } = renderHook(() => useVoicePreview());
    // Mock browser voice that matches our voice option
    mockGetVoices.mockReturnValue([
      { voiceURI: "voice-1", name: "Browser Voice", lang: "en-US" },
    ]);

    const voice = { id: "voice-1", label: "Voice One", lang: "en-US" };

    act(() => {
      result.current.playPreview(voice);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockGetVoices).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  it("onend handler resets playing state", async () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = { id: "voice-1", label: "Voice One", lang: "en-US" };

    act(() => {
      result.current.playPreview(voice);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isPreviewPlaying).toBe(true);

    // Simulate onend callback
    const utterance = createdUtterances[0];
    act(() => {
      utterance.onend?.({} as Event);
    });

    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it("onerror handler resets playing state", async () => {
    const { result } = renderHook(() => useVoicePreview());
    const voice = { id: "voice-1", label: "Voice One", lang: "en-US" };

    act(() => {
      result.current.playPreview(voice);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isPreviewPlaying).toBe(true);

    // Simulate onerror callback
    const utterance = createdUtterances[0];
    act(() => {
      utterance.onerror?.({} as Event);
    });

    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });
});
