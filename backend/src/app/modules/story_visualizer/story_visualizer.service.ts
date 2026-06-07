import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import {
  GenerationTimeoutError,
  raceGenerationWithTimeout,
} from "../../../utils/generation_timeout";
import { generateStoryboardWithGemini } from "../ai_model/ai_model.utils";
import {
  IStoryVisualizerPayload,
  IStoryVisualizerResult,
  IStoryboardScene,
} from "./story_visualizer.interface";
import { generateStoryboardImage } from "../../../utils/storyboard_image_generation";

const STORY_VISUALIZER_TIMEOUT_MS = 90000;

const mapStoryVisualizerError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof GenerationTimeoutError) {
    throw new ApiError(
      httpStatus.GATEWAY_TIMEOUT,
      "Story visualizer generation timed out. Please try again."
    );
  }

  const errorMsg = error instanceof Error ? error.message : String(error);
  throw new ApiError(
    httpStatus.BAD_GATEWAY,
    `Story visualizer generation failed: ${errorMsg}`
  );
};

const buildStoryboardImagePrompt = (
  styleGuide: string,
  scenePrompt: string
): string => {
  return [
    "Create a consistent storybook illustration for this storyboard scene.",
    "Use the shared visual style guide exactly for character and world consistency.",
    `Shared style guide: ${styleGuide}`,
    `Scene visual prompt: ${scenePrompt}`,
    "Render as polished storybook artwork with cinematic composition, expressive characters, coherent lighting, and rich atmosphere.",
    "Do not include text, captions, watermarks, logos, or artist signatures in the image.",
  ].join("\n\n");
};

const attachSceneImages = async (
  scenes: IStoryboardScene[],
  styleGuide: string
): Promise<IStoryboardScene[]> => {
  const promises = scenes.map(async (scene) => {
    try {
      const imageUrl = await generateStoryboardImage(
        buildStoryboardImagePrompt(styleGuide, scene.imagePrompt)
      );

      return {
        ...scene,
        ...(imageUrl ? { imageUrl } : {}),
        imageStatus: imageUrl ? ("generated" as const) : ("failed" as const),
      };
    } catch (error) {
      return {
        ...scene,
        imageStatus: "failed" as const,
      };
    }
  });

  return Promise.all(promises);
};

const generateStoryboard = async (
  payload: IStoryVisualizerPayload
): Promise<IStoryVisualizerResult> => {
  const language = payload.language ?? "English";

  try {
    const storyboard = await raceGenerationWithTimeout(
      () =>
        generateStoryboardWithGemini({
          ...payload,
          language,
        }),
      STORY_VISUALIZER_TIMEOUT_MS
    );

    const scenes = await attachSceneImages(
      storyboard.scenes,
      storyboard.styleGuide
    );

    return {
      ...storyboard,
      scenes,
    };
  } catch (error) {
    return mapStoryVisualizerError(error);
  }
};

export const StoryVisualizerService = {
  generateStoryboard,
};
