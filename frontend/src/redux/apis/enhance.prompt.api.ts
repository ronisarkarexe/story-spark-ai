// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE: frontend/src/redux/apis/enhance.prompt.api.ts
// Follows the exact same pattern as aiModelApi.ts
// ─────────────────────────────────────────────────────────────────────────────

import baseApi from "../base_api/base.api";
import { tagTypes } from "../tag-types";

const STORY_VERSION_URL = "story";

export interface IEnhancePromptRequest {
  prompt: string;
  provider?: string;
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
        data: { prompt: data.prompt },
        headers: data.provider ? { "x-model-provider": data.provider } : undefined,
      }),
      transformResponse: (response: IEnhancePromptResponse) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model],
    }),
  }),
});

export const { useEnhancePromptMutation } = enhancePromptApi;