// ─────────────────────────────────────────────────────────────
// NEW FILE: frontend/src/redux/apis/enhance.prompt.api.ts
// ─────────────────────────────────────────────────────────────

import baseApi from "../base_api/base.api";
import { tagTypes } from "../tag-types";

const STORY_VERSION_URL = "story-version";

export interface IEnhancePromptRequest {
  prompt: string;
}

export interface IEnhancePromptResponse {
  data: { enhancedPrompt: string };
  message: string;
}

const enhancePromptApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    enhancePrompt: build.mutation<IEnhancePromptResponse, IEnhancePromptRequest>({
      query: (data) => ({
        url: `/${STORY_VERSION_URL}/enhance-prompt`,
        method: "POST",
        body: data, // ✅ use "body" instead of "data"
      }),
      transformResponse: (response: IEnhancePromptResponse) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.prompt], // ✅ adjust tag type if needed
    }),
  }),
});

export const { useEnhancePromptMutation } = enhancePromptApi;