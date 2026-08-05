export interface SceneSummary {
  id: number;
  title: string;
  summary: string;
}

export function generateSceneSummaries(
  story: string
): SceneSummary[] {
  const scenes = story
    .split(/\n\s*\n/)
    .filter((scene) => scene.trim().length > 0);

  return scenes.map((scene, index) => ({
    id: index + 1,
    title: `Scene ${index + 1}`,
    summary:
      scene.split(".").slice(0, 2).join(".").trim() +
      (scene.length > 120 ? "..." : ""),
  }));
}