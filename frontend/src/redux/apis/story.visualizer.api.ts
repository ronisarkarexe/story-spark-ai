import baseApi from "../base_api/base.api";
import { STORY_VISUALIZER_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

export type StoryboardScene = {
  sceneNumber: number;
  caption: string;
  imagePrompt: string;
  imageUrl?: string;
  imageStatus?: "generated" | "failed" | "pending";
};

export type GenerateStoryVisualsRequest = {
  title: string;
  content: string;
  genre?: string;
  language?: string;
};

export type GenerateStoryVisualsResponse = {
  scenes: StoryboardScene[];
  styleGuide: string;
};

const storyVisualizerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    generateStoryVisuals: build.mutation<
      { data: GenerateStoryVisualsResponse; message: string },
      GenerateStoryVisualsRequest
    >({
      query: (data) => ({
        url: `/${STORY_VISUALIZER_URL}/generate`,
        method: "POST",
        data,
      }),
      transformResponse: (response: {
        data: GenerateStoryVisualsResponse;
        message: string;
      }) => ({
        data: response.data,
        message: response.message,
      }),
      invalidatesTags: [tagTypes.model],
    }),
  }),
});

export const { useGenerateStoryVisualsMutation } = storyVisualizerApi;
