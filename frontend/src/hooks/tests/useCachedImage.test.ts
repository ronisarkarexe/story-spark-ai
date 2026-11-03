/**
 * @vitest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { renderHook, waitFor } from '@testing-library/react';
import { useCachedImage } from '../useCachedImage';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getCachedImageUrl } from '../../utils/imageCache';

// getCachedImageUrl ko mock karo
vi.mock('../../utils/imageCache', () => ({
  getCachedImageUrl: vi.fn(),
}));

describe('useCachedImage hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state for falsy src', () => {
    const { result } = renderHook(() => useCachedImage(undefined));
    expect(result.current.cachedSrc).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('sets isLoading to true when src is provided', () => {
    // Promise ko resolve hone se roko
    (getCachedImageUrl as any).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCachedImage('test-image.jpg'));
    
    expect(result.current.isLoading).toBe(true);
  });

  it('sets cachedSrc on success', async () => {
    (getCachedImageUrl as any).mockResolvedValue('blob:http://cached-url');
    const { result } = renderHook(() => useCachedImage('test-image.jpg'));
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cachedSrc).toBe('blob:http://cached-url');
  });

  it('handles error fallback to original src', async () => {
    (getCachedImageUrl as any).mockRejectedValue(new Error('Cache failed'));
    const { result } = renderHook(() => useCachedImage('original.jpg'));
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cachedSrc).toBe('original.jpg');
  });

  it('does not update state after unmount', async () => {
    let resolvePromise: (value: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    (getCachedImageUrl as any).mockReturnValue(promise);
    
    const { result, unmount } = renderHook(() => useCachedImage('test.jpg'));
    
    unmount();
    
    // Promise resolve karo unmount hone ke baad
    await resolvePromise!('blob:new');
    
    // State update nahi honi chahiye kyunki component unmount ho chuka hai
    expect(result.current.cachedSrc).toBeUndefined();
  });
});