import baseApi from "../base_api/base.api";

const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    chatWithAi: build.mutation({
      query: (data) => ({
        url: `/chat`,
        method: "POST",
        data: data,
      }),
    }),
  }),
});

export const { useChatWithAiMutation } = chatApi;
