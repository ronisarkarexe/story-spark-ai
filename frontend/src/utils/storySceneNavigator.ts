export interface StoryScene {
  id: number;
  title: string;
  content: string;
}

export function detectScenes(
  story: string
): StoryScene[] {
  const sections = story
    .split(/\n\s*\n/)
    .filter((section) => section.trim() !== "");

  return sections.map((section, index) => ({
    id: index + 1,
    title: `Scene ${index + 1}`,
    content: section,
  }));
}

export function renameScene(
  scenes: StoryScene[],
  id: number,
  title: string
) {
  return scenes.map((scene) =>
    scene.id === id
      ? { ...scene, title }
      : scene
  );
}

export function getSceneCount(
  story: string
): number {
  return detectScenes(story).length;
}

export function getSceneWordDensity(
  scenes: StoryScene[]
): number {
  if (scenes.length === 0) return 0;

  const totalWords = scenes.reduce(
    (sum, scene) =>
      sum +
      scene.content.trim().split(/\s+/).filter(Boolean).length,
    0
  );

  return Math.round(totalWords / scenes.length);
}