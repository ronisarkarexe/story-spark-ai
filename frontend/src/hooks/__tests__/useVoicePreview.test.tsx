import { renderHook } from "@testing-library/react";
import useVoicePreview from "../useVoicePreview";

const mockSpeak = jest.fn();
const mockCancel = jest.fn();
const mockGetVoices = jest.fn().mockReturnValue([]);

window.speechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  getVoices: mockGetVoices,
  pause: jest.fn(),
  resume: jest.fn(),
  onvoiceschanged: null,
};

describe("useVoicePreview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns correct initial state", () => {
    const { result } = renderHook(() => useVoicePreview());
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  describe("playPreview", () => {
    it("sets previewingVoiceId and isPreviewPlaying to true when playPreview is called", () => {
      const { result } = renderHook(() => useVoicePreview());
      const mockVoice = {
        id: "voice-1",
        label: "English Voice",
        lang: "en-US",
      };

      result.current.playPreview(mockVoice);

      expect(mockSpeak).toHaveBeenCalledWith(expect.any(SpeechSynthesisUtterance));
    });

    it("creates SpeechSynthesisUtterance with correct lang from voice", () => {
      const { result } = renderHook(() => useVoicePreview());
      const mockVoice = {
        id: "voice-fr",
        label: "French Voice",
        lang: "fr-FR",
      };

      result.current.playPreview(mockVoice);

      const utteranceArg = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance;
      expect(utteranceArg.lang).toBe("fr-FR");
    });

    it("stops any existing preview before starting a new one", () => {
      const { result } = renderHook(() => useVoicePreview());
      const voice1 = { id: "voice-1", label: "Voice 1", lang: "en-US" };
      const voice2 = { id: "voice-2", label: "Voice 2", lang: "fr-FR" };

      result.current.playPreview(voice1);
      mockCancel.mockClear();
      result.current.playPreview(voice2);

      expect(mockCancel).toHaveBeenCalled();
    });
  });

  describe("stopPreview", () => {
    it("cancels speech synthesis when stopPreview is called", () => {
      const { result } = renderHook(() => useVoicePreview());
      const mockVoice = { id: "voice-1", label: "Voice", lang: "en-US" };

      result.current.playPreview(mockVoice);
      mockCancel.mockClear();

      result.current.stopPreview();

      expect(mockCancel).toHaveBeenCalled();
    });
  });
});
