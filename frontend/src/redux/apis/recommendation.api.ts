import baseApi from "../base_api/base.api";

const recommendationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPersonalizedRecommendations: build.query({
      query: () => ({
        url: "/recommendations/personalized",
        method: "GET",
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => response.data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ["Recommendation"] as any,
    }),
  }),
});

export const { useGetPersonalizedRecommendationsQuery } = recommendationApi;
