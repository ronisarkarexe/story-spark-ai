export function clearStorySession(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem('storySession');
  } catch {
    // Ignore storage restriction error
  }
}
