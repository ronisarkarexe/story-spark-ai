import baseApi from "../base_api/base.api";

const engagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    analyzeEngagement: build.mutation({
      query: (body: { chapterText: string; title?: string }) => ({
        url: "/engagement/analyze",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const { useAnalyzeEngagementMutation } = engagementApi;