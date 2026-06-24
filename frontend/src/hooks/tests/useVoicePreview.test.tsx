// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useVoicePreview from '../useVoicePreview';

const mockCancel = vi.fn();
let lastUtterance: any = null;

class MockSpeechSynthesisUtterance {
  lang: string = '';
  rate: number = 1;
  text: string;
  voice: unknown = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
    lastUtterance = this;
  }
}

const mockSpeak = vi.fn().mockImplementation(() => {
  if (lastUtterance && lastUtterance.onstart) {
    lastUtterance.onstart();
  }
});

// This matches SpeechVoiceOption shape the hook expects
const mockVoice = {
  id: 'voice-1',
  name: 'Voice 1',
  lang: 'en-US',
  voiceURI: 'voice-1',
};

const mockVoice2 = {
  id: 'voice-2',
  name: 'Voice 2',
  lang: 'es-ES',
  voiceURI: 'voice-2',
};

beforeEach(() => {
  lastUtterance = null;
  vi.stubGlobal('speechSynthesis', {
    cancel: mockCancel,
    speak: mockSpeak,
    getVoices: vi.fn().mockReturnValue([mockVoice, mockVoice2]),
  });
  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    MockSpeechSynthesisUtterance
  );
  mockCancel.mockClear();
  mockSpeak.mockClear();
});

describe('useVoicePreview', () => {

  it('should return correct initial state', () => {
    const { result } = renderHook(() => useVoicePreview());
    expect(result.current.previewingVoiceId).toBeNull();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it('playPreview sets previewingVoiceId and isPreviewPlaying', () => {
    const { result } = renderHook(() => useVoicePreview());
    act(() => {
      result.current.playPreview(mockVoice as any);
    });
    expect(result.current.previewingVoiceId).toBe('voice-1');
    expect(result.current.isPreviewPlaying).toBe(true);
  });

  it('playPreview creates utterance with correct lang', () => {
    const { result } = renderHook(() => useVoicePreview());
    act(() => {
      result.current.playPreview(mockVoice as any);
    });
    expect(lastUtterance).not.toBeNull();
    expect(lastUtterance.lang).toBe('en-US');
  });

  it('stopPreview cancels speech and resets state', () => {
    const { result } = renderHook(() => useVoicePreview());
    act(() => { result.current.playPreview(mockVoice as any); });
    act(() => { result.current.stopPreview(); });
    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.isPreviewPlaying).toBe(false);
  });

  it('playPreview stops previous before starting new', () => {
    const { result } = renderHook(() => useVoicePreview());
    act(() => { result.current.playPreview(mockVoice as any); });
    act(() => { result.current.playPreview(mockVoice2 as any); });
    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.previewingVoiceId).toBe('voice-2');
  });

});