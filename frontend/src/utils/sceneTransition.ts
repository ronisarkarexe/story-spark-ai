export interface SceneTransition {
  scene: number;
  status: "Good" | "Abrupt";
  suggestion: string;
}

export function analyzeSceneTransitions(
  story: string
): SceneTransition[] {
  const scenes = story
    .split(/\n\s*\n/)
    .filter((scene) => scene.trim());

  return scenes.map((scene, index) => {
    const abrupt =
      scene.includes("Suddenly") ||
      scene.includes("Immediately") ||
      scene.length < 120;

    return {
      scene: index + 1,
      status: abrupt ? "Abrupt" : "Good",
      suggestion: abrupt
        ? "Consider adding a smoother transition between scenes."
        : "Transition flows naturally.",
    };
  });
}