import { SceneScore } from "../types/scene";

export function analyzeScenes(story: string): SceneScore[] {

    const scenes = story.split("##");

    return scenes.map((scene, index) => {

        let score = 50;

        const reasons = [];

        if (scene.includes("battle")) {

            score += 20;
            reasons.push("Advances the main conflict.");

        }

        if (scene.includes("character")) {

            score += 15;
            reasons.push("Improves character development.");

        }

        if (scene.includes("kingdom")) {

            score += 10;
            reasons.push("Expands world-building.");

        }

        if (scene.length < 120) {

            score -= 15;
            reasons.push("Scene contains limited narrative content.");

        }

        return {

            id: index + 1,

            title: `Scene ${index + 1}`,

            importance: Math.max(0, Math.min(score,100)),

            reasons,

            recommendation:
                score < 60
                    ? "Consider strengthening this scene."
                    : "Scene contributes well to the narrative.",

            needsRevision: score < 60,

        };

    });

}