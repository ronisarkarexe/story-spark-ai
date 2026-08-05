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