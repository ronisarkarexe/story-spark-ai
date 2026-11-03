export function clearStorySession(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem("storySession");
}
