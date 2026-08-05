/**
 * Smoothly scrolls the chapter with the given id into view.
 * Chapter blocks are given id={`chapter-${chapter.id}`} in StoryViewer.tsx.
 * scrollIntoView finds the nearest scrollable ancestor on its own, so this
 * works across sibling components (sidebar -> viewer) without needing a
 * shared ref or context.
 */
export function scrollToChapter(chapterId: number): void {
  const node = document.getElementById(`chapter-${chapterId}`);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}